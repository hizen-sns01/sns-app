'use client';

import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the NEXT_PUBLIC_ prefix to make it available on the client side
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error("NEXT_PUBLIC_GOOGLE_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.");
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || '');

export async function generateGeminiResponse(prompt: string, modelName: string) {
  try {
    if (!GOOGLE_API_KEY) {
      throw new Error("API 키가 설정되지 않았습니다. .env.local 파일의 NEXT_PUBLIC_GOOGLE_API_KEY를 확인해주세요.");
    }

    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    if (!result) {
      throw new Error("API 응답이 없습니다.");
    }

    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("응답 텍스트가 비어있습니다.");
    }

    console.log("Gemini 응답:", text); // 디버깅용 로그
    return text;
  } catch (error) {
    console.error("Gemini API 에러:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API 오류: ${error.message}`);
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }
}