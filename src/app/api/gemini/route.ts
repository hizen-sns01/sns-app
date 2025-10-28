import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error("GOOGLE_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.");
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    if (!GOOGLE_API_KEY) {
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const { prompt, modelName } = await req.json();

    if (!prompt || !modelName) {
      return NextResponse.json({ error: "prompt와 modelName을 제공해야 합니다." }, { status: 400 });
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
    });

    if (!result) {
      return NextResponse.json({ error: "API 응답이 없습니다." }, { status: 500 });
    }

    const response = await result.response;
    const text = response.text();

    if (!text) {
      return NextResponse.json({ error: "응답 텍스트가 비어있습니다." }, { status: 500 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API 에러:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Gemini API 오류: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: "알 수 없는 오류가 발생했습니다." }, { status: 500 });
    }
  }
}
