import os
import time
import uuid
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

from utils import scrape_url, process_article_pipeline

app = FastAPI(title="NewsLens API", description="Hybrid NLP & AI News Information Extraction")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["newslens"]
articles_collection = db["articles"]

class PipelineRequest(BaseModel):
    url: str

@app.post("/pipeline")
async def endpoint_pipeline(req: PipelineRequest):
    from utils import extract_article_links
    import trafilatura
    
    try:
        downloaded = trafilatura.fetch_url(req.url)
        if not downloaded:
            raise HTTPException(status_code=400, detail="Could not fetch URL.")
            
        scraped_data = scrape_url(req.url, downloaded)
        
        articles_to_process = []
        
        if scraped_data["title"] == "Not an Article" or not scraped_data["text"]:
            links = extract_article_links(req.url, downloaded)
            if not links:
                raise HTTPException(status_code=400, detail="Provided URL is not an article and no valid sub-links were found.")
            for link in links:
                sub_data = scrape_url(link)
                if sub_data["text"] and sub_data["title"] != "Not an Article":
                    articles_to_process.append(sub_data)
        else:
            articles_to_process.append(scraped_data)
            
        if not articles_to_process:
             raise HTTPException(status_code=400, detail="No readable article text could be found on the page or nested links.")

        results = []
        for article_data in articles_to_process:
            analyzed_list = process_article_pipeline(article_data["text"])
            
            for analyzed_data in analyzed_list:
                art_id = str(uuid.uuid4())[:8]
                date_str = time.strftime("%Y-%m-%d")
                
                final_title = analyzed_data.get("title", article_data["title"])
                if final_title == "Headline" or len(final_title) < 5:
                    final_title = article_data["title"]
                    
                analyzed_data.pop("title", None)
                
                existing_doc = articles_collection.find_one({"title": final_title})
                if existing_doc:
                    existing_doc.pop("_id", None)
                    results.append(existing_doc)
                    continue
                
                full_doc = {
                    "id": art_id,
                    "title": final_title,
                    "source": article_data["source"],
                    "date": date_str,
                    "raw_text": article_data["text"][:2000],
                    "text": analyzed_data.get("content", article_data["text"]),
                    **{k: v for k, v in analyzed_data.items() if k != "content"}
                }
                
                articles_collection.insert_one(full_doc)
                full_doc.pop("_id", None)
                results.append(full_doc)
        
        return {"status": "success", "data": results[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/articles")
async def endpoint_get_articles():
    try:
        cursor = articles_collection.find().sort("_id", -1)
        results = []
        for doc in cursor:
            doc.pop("_id", None)
            results.append(doc)
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/articles/{art_id}")
async def endpoint_delete_article(art_id: str):
    try:
        res = articles_collection.delete_one({"id": art_id})
        if res.deleted_count == 0:
             raise HTTPException(status_code=404, detail="Article not found")
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)