import ChatComponent from '@/components/ChatComponent'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">AI Chat Assistant</h1>
      <ChatComponent />
    </main>
  )
}
