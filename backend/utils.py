import os
import json
import time
import requests
import trafilatura
import nltk
import numpy as np
import networkx as nx
from typing import Dict, Any, List
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def init_nltk():
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt', quiet=True)
        nltk.download('punkt_tab', quiet=True)
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords', quiet=True)

init_nltk()

from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

def extract_article_links(base_url: str, html_content: str, max_links: int = 15) -> List[str]:
    soup = BeautifulSoup(html_content, 'html.parser')
    links = []
    base_domain = urlparse(base_url).netloc
    
    for a in soup.find_all('a', href=True):
        href = a['href']
        full_url = urljoin(base_url, href)
        parsed = urlparse(full_url)
        
        if parsed.netloc != base_domain:
            continue
            
        path = parsed.path
        if len(path) > 15 and ('-' in path or any(c.isdigit() for c in path) or '/article/' in path or '/news/' in path):
            if full_url not in links:
                links.append(full_url)
        if len(links) >= max_links:
            break
    return links

def scrape_url(url: str, downloaded_html: str = None) -> Dict[str, Any]:
    try:
        if not downloaded_html:
            downloaded_html = trafilatura.fetch_url(url)
        
        if downloaded_html is None:
            raise ValueError(f"Could not fetch {url}")
        
        text = trafilatura.extract(downloaded_html, include_comments=False, include_tables=False)
        is_homepage = False
        
        if not text or len(text) < 100:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(downloaded_html, 'html.parser')
            text = soup.get_text(separator=' ', strip=True)
            is_homepage = True

        metadata = trafilatura.extract_metadata(downloaded_html)
        title = metadata.title if metadata and metadata.title else "Scraped Website"
        
        return {
            "title": title,
            "text": text[:20000],
            "source": url,
            "is_homepage": is_homepage
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return {"title": "Error Scraping", "text": "", "source": url, "is_homepage": False}

def get_extractive_summary(text: str, top_n: int = 5) -> str:
    sentences = sent_tokenize(text)
    if len(sentences) <= top_n:
        return text

    stop_words = set(stopwords.words('english'))
    
    vectorizer = TfidfVectorizer(stop_words=list(stop_words))
    try:
        X = vectorizer.fit_transform(sentences)
        sim_mat = cosine_similarity(X, X)
        
        nx_graph = nx.from_numpy_array(sim_mat)
        scores = nx.pagerank(nx_graph)
        
        ranked_sentences = sorted(((scores[i], s) for i, s in enumerate(sentences)), reverse=True)
        summary = " ".join([s[1] for s in ranked_sentences[:top_n]])
        return summary
    except Exception as e:
        print(f"TextRank Error: {e}")
        return " ".join(sentences[:top_n])

def get_keywords_tfidf(text: str, top_n: int = 15) -> List[str]:
    stop_words = set(stopwords.words('english'))
    vectorizer = TfidfVectorizer(stop_words=list(stop_words), max_features=top_n)
    try:
        vectorizer.fit_transform([text])
        return vectorizer.get_feature_names_out().tolist()
    except Exception:
        return []

def try_parse_json(response_text: str) -> Any:
    try:
        raw = response_text
        if "```json" in raw:
            raw = raw.split("```json")[-1].split("```")[0]
        elif "```" in raw:
            raw = raw.split("```")[-1].split("```")[0]
        return json.loads(raw.strip())
    except Exception:
        return None

def process_article_pipeline(text: str) -> List[Dict[str, Any]]:
    extractive_summary = get_extractive_summary(text, top_n=4)
    raw_keywords = get_keywords_tfidf(text, top_n=15)
    
    categories_hint = "Geopolitics, Macroeconomics, Technology & AI, Business & Finance, Healthcare & Biotech, Space & Aerospace, Climate & Environment, Arts & Culture, Lifestyle, Sports Management, Legal & Justice, Global Conflict, Human Rights, Digital Economy."
    
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        return [{
            "title": "API Key Missing",
            "category": "Error",
            "summary": "OPENROUTER_API_KEY is not set in backend/.env!",
            "nlp_keywords": raw_keywords,
            "entities": {},
            "financial_data": [],
            "events": []
        }]
        
    prompt = f"""
    You are a master news intelligence analyst. You are given a massive raw text dump from a news homepage or article.
    Your task is to identify and extract EVERY distinct, major news story found in the text. Do not omit stories.
    For EACH distinct story, output a highly structured JSON object in an ARRAY. 

    Recommended Categories: {categories_hint} (or create highly precise sub-categories).

    Required JSON Array structure strictly:
    [
      {{
        "title": "STRING (Complete headline)",
        "category": "STRING (Precise category)",
        "summary": "STRING (A professional 1-2 sentence abstractive overview)",
        "content": "STRING (Full, professionally written article body generated from the source facts)",
        "sentiment": "STRING (Positive/Negative/Neutral)",
        "probability": 1.0, 
        "entities": {{
          "ORG": ["List of organizations mentioned"],
          "PERSON": ["List of people mentioned in this specific story"]
        }},
        "financial_data": [
           {{ "company": "Company Name", "change": "rose/fell by X%", "context": "Reason for move" }}
        ],
        "events": [
           {{ "name": "Event name", "description": "1 sentence description", "importance": "High/Medium/Low" }}
        ]
      }}
    ]

    Data Source Text:
    {text[:25000]}
    """

    try:
        res_data = None
        last_error = None
        
        for attempt in range(5):
            try:
                response = requests.post(
                  url="https://openrouter.ai/api/v1/chat/completions",
                  headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-OpenRouter-Title": "NewsLens",
                  },
                  data=json.dumps({
                    "model": "z-ai/glm-4.5-air:free",
                    "messages": [
                      {"role": "user", "content": prompt}
                    ]
                  }),
                  timeout=30
                )
                
                response.raise_for_status()
                res_data = response.json()
                break
                
            except Exception as loop_e:
                last_error = loop_e
                print(f"OpenRouter Attempt {attempt + 1}/5 Failed: {loop_e}")
                if attempt < 4:
                    time.sleep(2)
                    
        if res_data is None:
            raise ValueError(f"Failed after 5 attempts. Last Error: {last_error}")
            
        ai_msg = res_data['choices'][0]['message']['content']
        
        parsed = try_parse_json(ai_msg)
        
        if not parsed or not isinstance(parsed, list):
            raise ValueError("AI did not return a valid JSON array.")
            
        results = []
        for item in parsed:
            results.append({
                "title": item.get("title", "Headline"),
                "category": item.get("category", "General"),
                "probability": 1.0, 
                "sentiment": "Neutral", 
                "summary": item.get("summary", ""),
                "content": item.get("content", ""),
                "nlp_extractive_summary": extractive_summary,
                "nlp_keywords": raw_keywords,
                "entities": item.get("entities", {}),
                "financial_data": item.get("financial_data", []),
                "events": item.get("events", [])
            })
        return results
        
    except Exception as e:
        print(f"OpenRouter Verification Error: {e}")
        return [{
            "title": "Homepage Extraction",
            "category": "Analyzed (Local NLP)",
            "summary": f"AI processing failed. Please try a simpler URL. Details: {str(e)[:150]}",
            "nlp_extractive_summary": extractive_summary,
            "nlp_keywords": raw_keywords,
            "entities": {"ORG": [], "PERSON": []},
            "financial_data": [],
            "events": [],
            "probability": 0
        }]