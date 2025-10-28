'use client';

import { useState, useRef, useEffect } from 'react';
import { generateGeminiResponse } from '@/lib/gemini/client';

type GeminiModel = 'gemini-2.5-flash-live' | 'gemini-2.0-flash-lite' | 'gemini-2.5-flash-lite';

const MODEL_NAMES: Record<GeminiModel, string> = {
  'gemini-2.5-flash-live': 'Gemini 2.5 Flash Live',
  'gemini-2.0-flash-lite': 'Gemini 2.0 Flash Lite',
  'gemini-2.5-flash-lite': 'Gemini 2.5 Flash Lite'
};

export default function ChatComponent() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-2.5-flash-live');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      console.log('메시지 전송:', userMessage); // 디버깅용 로그
      
      // Get response from Gemini with selected model
      const response = await generateGeminiResponse(userMessage, selectedModel);
      console.log('응답 받음:', response); // 디버깅용 로그
      
      if (!response) {
        throw new Error('빈 응답이 반환되었습니다.');
      }
      
      // Add assistant response to chat history
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('채팅 응답 에러:', error);
      let errorMessage = '응답을 받지 못했습니다.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      // 에러 메시지도 채팅창에 표시
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `🚫 오류: ${errorMessage}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-center mb-4">Gemini Chat</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {(Object.keys(MODEL_NAMES) as GeminiModel[]).map((model) => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  selectedModel === model
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {MODEL_NAMES[model]}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chat history */}
        <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                생각하는 중...
              </div>
            </div>
          )}
        </div>

        {/* Message input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}