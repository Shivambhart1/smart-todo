import openai
from django.conf import settings
from datetime import datetime, timedelta

openai.api_key = settings.API_KEY

def get_ai_suggestions(title, context):
  prompt = f"""
You are an intelligent task assistant.

Given:
- Task Title: "{title}"
- Context: "{context}"

Return a JSON with the following:
- enhanced_description: a clearer or more detailed version of the task
- suggested_category: a category like Work, Personal, Study, etc.
- priority_score: a number from 0 to 1 (1 = most urgent)
- suggested_deadline: deadline in ISO 8601 format, e.g., 2025-07-07T18:00:00Z

Strictly return only the JSON object, no extra text.
"""
  
  try:
    response = openai.chat.completions.create(
      model = "gpt-3.5-turbo",
      messages = [
        {"role": "user", "content": prompt}
      ]
    )

    content = response['choices'][0]['message']['content']
    return eval(content)
  except Exception as e:
    print(f"Error during AI suggestion: {e}")
    return {
      "enhanced_description": "",
      "suggested_category": "General",
      "priority_score": 0.5,
      "suggested_deadline": (datetime.utcnow() + timedelta(days=1)).isoformat() + 'Z'
    }