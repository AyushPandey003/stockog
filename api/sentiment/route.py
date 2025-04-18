from http import HTTPStatus
from typing import Any
from vercel import VercelResponse, VercelRequest
import os
import google.generativeai as genai
import json

async def handler(req: VercelRequest, res: VercelResponse) -> Any:
    if req.method != "POST":
        return res.status(HTTPStatus.METHOD_NOT_ALLOWED).json({"error": "Method not allowed"})

    try:
        body = await req.json()
        articles = body.get("articles", [])

        # Configure Gemini API
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        model = genai.GenerativeModel("gemini-1.5-flash")

        sentiments = []
        for article in articles:
            # Create prompt for sentiment analysis
            prompt = f"""
            Analyze the sentiment of this news article about the stock market:
            Title: {article['title']}
            Description: {article['description']}
            
            Return only one word - 'positive', 'negative', or 'neutral'.
            """
            
            # Generate response
            response = model.generate_content(prompt)
            
            # Extract sentiment
            sentiment = response.text.strip().lower()
            
            # Validate and normalize sentiment
            if "positive" in sentiment:
                sentiment = "positive"
            elif "negative" in sentiment:
                sentiment = "negative"
            else:
                sentiment = "neutral"
                
            # Add to results
            sentiments.append({
                "title": article["title"],
                "sentiment": sentiment
            })

        return res.status(HTTPStatus.OK).json({"sentiments": sentiments})
    except Exception as e:
        print(f"Error in sentiment analysis: {str(e)}")
        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({"error": str(e)}) 