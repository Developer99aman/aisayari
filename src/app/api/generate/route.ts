import { NextRequest, NextResponse } from 'next/server';

// Google Gemini API key from environment variable
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!API_KEY) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }
    
    const { theme, language = 'Hindi', customInput = '', lineCount = 4, length = 'Medium' } = await request.json();
    
    // Determine token count based on length
    let maxTokens = 1024; // Default for Medium
    if (length === 'Short') {
      maxTokens = 512;
    } else if (length === 'Long') {
      maxTokens = 1536;
    }
    
    // Construct the prompt for Gemini API
    let prompt = `Generate a beautiful and meaningful shayari in ${language} on the theme of "${theme}". `;
    
    // Add custom input if provided
    if (customInput.trim()) {
      prompt += `Include these words, sentences, or facts in the shayari: "${customInput}". `;
    }
    
    // Add line count requirement
    prompt += `The shayari should have approximately ${lineCount} lines. `;
    
    // Add general instructions
    prompt += `The shayari should be poetic, emotional, and resonate with readers. 
    Please provide only the shayari text without any additional explanation or commentary.`;
    
    // Request body for Gemini API - updated to match v1 format
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: maxTokens
      }
    };

    // Call Gemini API
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return NextResponse.json({ 
        error: errorData.error?.message || 'Failed to generate shayari' 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract the generated text from the response
    let generatedText = '';
    if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
      generatedText = data.candidates[0].content.parts[0].text;
    } else if (data.promptFeedback?.blockReason) {
      return NextResponse.json({ 
        error: `Content blocked: ${data.promptFeedback.blockReason}` 
      }, { status: 400 });
    } else {
      console.error('Unexpected API response format:', data);
      return NextResponse.json({ 
        error: 'Unexpected response format from API' 
      }, { status: 500 });
    }

    return NextResponse.json({ shayari: generatedText });
  } catch (error) {
    console.error('Error generating shayari:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate shayari' 
    }, { status: 500 });
  }
}