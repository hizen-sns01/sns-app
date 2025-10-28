'use client';

export async function generateGeminiResponse(prompt: string, modelName: string) {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, modelName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API 요청에 실패했습니다.');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini 응답 생성 에러:", error);
    if (error instanceof Error) {
      throw new Error(`Gemini API 오류: ${error.message}`);
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }
}