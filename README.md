# NewsLens

NewsLens is an intelligent web-based platform for **News Classification and Financial Information Extraction**. It scrapes real news from the BBC and financial news sites, classifies articles into standard categories (Business, Politics, Technology, Sports), extracts core entities (People, Organizations, Money, Dates) and financial insights (like stock percentage changes), and presents the results in a highly interactive and aesthetically pleasing UI.

## Features
- **Dynamic Web Scraping:** Uses Selenium to gracefully scrape news content dynamically, even from JavaScript-powered sites.
- **NLP Text Classification:** Two functional modes! A baseline TF-IDF + Logistic Regression, and an advanced mode running a HuggingFace Transformer model.
- **Financial & Event Extraction:** Detects stock movements (e.g. "rose 5%") and corporate events like acquisitions or earnings using regex and heuristic patterns.
- **Sentiment Analysis:** Includes VADER polarity to determine if the news is positive, neutral, or negative.
- **Sleek Frontend:** A responsive React UI using Framer Motion animations and deeply styled Glassmorphism UI tokens in Dark Mode.

## Tech Stack
- **Backend:** Python, FastAPI, Selenium, spaCy, Scikit-learn, Transformers, BeautifulSoup4, SQLite
- **Frontend:** React.js, React Router, Recharts, Framer Motion, Axios, Tailwind-Free Custom CSS

---

## Setup Instructions

### 1. Backend

**Dependencies Installation:**
Navigate to the `backend/` directory:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

**Download NLP Models:**
You must manually download the spaCy and NLTK components for the extraction engine to work correctly:
```bash
python -m spacy download en_core_web_sm
```
*Note: The HuggingFace transformer model for advanced text classification will download automatically on first inference, parsing ~300mb of weights. Please be patient on the first `/analyze` API call.*

**Run the Server:**
Launch the FastAPI uvicorn daemon:
```bash
uvicorn server:app --reload
```
The server will bind to `http://localhost:8000`.

### 2. Frontend

**Dependencies Installation:**
Navigate to the `frontend/` directory:
```bash
cd frontend
yarn install
```

**Run the Frontend:**
Launch the React development server:
```bash
yarn start
```
The app will bind to `http://localhost:3000`.

---

## Example API Responses

### `POST /analyze`
**Request:**
```json
{
  "text": "Apple acquired a new AI startup today. The tech giant's stock rose 4.5% following the announcement."
}
```

**Response:**
```json
{
  "category": "Technology",
  "probability": 0.89,
  "sentiment": "Positive",
  "entities": {
    "ORG": ["Apple"],
    "DATE": ["today"]
  },
  "financial_data": [
    {
      "company": "The tech giant",
      "change": "rose 4.5%"
    }
  ],
  "events": ["Acquisition"]
}
```

## License
MIT License
