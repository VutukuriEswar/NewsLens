## What is NewsLens?

NewsLens is a comprehensive web application designed to transform raw web URLs into structured news intelligence. It bridges the gap between unstructured web scraping and actionable data insights by combining hybrid NLP algorithms with Generative AI. The system automatically detects whether a URL is a specific news article or a broader homepage, extracts nested links if necessary, and processes the text through a dual-pipeline to generate enriched, categorized, and deduplicated news data.

## Key Features

🌐 **Intelligent Web Scraping**
- Input any news URL and let the system handle the rest.
- **Smart Homepage Detection:** Automatically distinguishes between a single article and an index/homepage.
- **Recursive Link Extraction:** If a homepage is detected, it uses heuristic URL parsing to find and extract up to 15 nested article links automatically.
- **Resilient Fetching:** Utilizes Trafilatura for primary extraction with a BeautifulSoup fallback for complex JavaScript-heavy homepages.

🧠 **Hybrid NLP & AI Processing Pipeline**
- **Local Extractive NLP:** Uses native TextRank (via NetworkX and Cosine Similarity) to generate unbiased extractive summaries and TF-IDF to map objective keyword density.
- **Generative AI Abstractive Analysis:** Sends enriched context to an LLM (via OpenRouter) to generate professional abstractive content, precise categorizations (based on IPTC Media Topics), and sentiment analysis.
- **Deep Entity Extraction:** Automatically identifies Organizations (ORG) and Persons (PERSON) mentioned in the text.

📊 **Structured Data Transformation**
- Parses unstructured text into highly structured JSON objects containing titles, summaries, full AI-generated content, financial data impacts (e.g., "Company X rose by Y%"), and timeline events with importance ratings.

🔄 **Automated Deduplication & Storage**
- **Smart MongoDB Deduplication:** Before saving, the database is queried to ensure articles with identical titles are never saved twice, saving API calls and storage.
- **Context Preservation:** Stores both the raw scraped text (capped for storage efficiency) and the final AI-enhanced text side-by-side.

🛡️ **Robust API Resilience**
- **Auto-Retry Logic:** Implements a 5-attempt automatic retry mechanism with backoff delays to handle OpenRouter rate limits or transient network failures seamlessly.
- **Graceful Degradation:** If the AI API key is missing or fails after retries, the system gracefully falls back to returning purely local NLP extracted data rather than crashing.

## Tech Stack

**Backend:**
- **FastAPI** (Python web framework)
- **MongoDB** with PyMongo for persistent database operations and deduplication
- **Trafilatura** & **BeautifulSoup4** for advanced web scraping and metadata extraction
- **NLTK** for natural language tokenization and stop-word management
- **Scikit-Learn** for TF-IDF vectorization and Cosine Similarity matrix generation
- **NetworkX** for native TextRank graph-based page ranking
- **Requests** for external LLM API communication
- **Pydantic** for robust API payload validation

**Frontend:**
- React for UI components (Consumes the NewsLens API)
- Tailwind CSS for styling

## Quick Start Guide

### Prerequisites
- Python 3.8+
- Node.js & npm/yarn
- MongoDB (local or cloud instance)
- OpenRouter API Key (Required for AI features, optional for local NLP fallback)

### Installation Steps

1. **Clone the repository**

2. **Set up virtual environment**
```bash
python -m venv venv
venv\Scripts\activate  # On Linux: source venv/bin/activate
```

3. **Install dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Run backend server**
```bash
uvicorn server:app --reload
```

5. **Install Dependencies & Start frontend**
Open a new terminal:
```bash
cd frontend
yarn install
yarn start
```

## API Endpoints

**Pipeline Processing:**
- `POST /pipeline` - Submit a URL for scraping, NLP analysis, AI enrichment, and database storage. Returns the primary processed article.

**Article Management:**
- `GET /articles` - Retrieve all previously processed and saved articles (sorted newest first).
- `DELETE /articles/{art_id}` - Remove a specific article from the database using its generated 8-character ID.

## Configuration Details

**NLP Initialization:**
- On startup, the application automatically checks for required NLTK data (`punkt`, `punkt_tab`, `stopwords`) and downloads them quietly if missing, ensuring zero manual setup for NLP features.

**AI Fallback Behavior:**
- If the `OPENROUTER_API_KEY` is not set in the `.env` file, the `/pipeline` endpoint will not crash. Instead, it will return a structured JSON response indicating the API key is missing, populated entirely with the local TextRank summary and TF-IDF keywords.

**Database Schema:**
- MongoDB documents are designed to be "frontend-ready." The internal MongoDB `_id` is systematically stripped from all API responses to prevent JSON serialization errors on the frontend.
- Documents merge local NLP outputs (`nlp_extractive_summary`, `nlp_keywords`) directly with AI outputs (`entities`, `financial_data`, `events`).

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

© 2026 Eswar Vutukuri, Vutla Yasaswi Venkat

## Acknowledgments

Thanks to OpenRouter for providing accessible LLM gateways, MongoDB for the flexible document database, FastAPI for the high-performance web framework, and the open-source NLP community. Special thanks to the creators of Trafilatura for making web content extraction reliable, and to the NetworkX/Scikit-Learn projects for enabling native, powerful extractive summarization without external API dependencies.