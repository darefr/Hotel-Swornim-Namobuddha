import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { buildSystemPrompt } from '@/lib/ai-context'
import { getConciergeContext } from '@/lib/queries'

export const runtime = 'nodejs'
export const maxDuration = 60

type ChatMessage = { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'unavailable',
        message:
          'The AI concierge is not configured yet. Please contact the hotel on WhatsApp or by email and our team will be delighted to help.',
      },
      { status: 503 },
    )
  }

  let body: { messages?: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : []
  if (messages.length === 0) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
  // Basic input sanitation / size limits
  const cleaned = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  const client = new OpenAI({
    apiKey,
    baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  })
  const model = process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'

  let liveContext = ''
  try {
    liveContext = await getConciergeContext()
  } catch {
    liveContext = 'Live data temporarily unavailable.'
  }

  const encoder = new TextEncoder()

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: 'system', content: buildSystemPrompt(liveContext) }, ...cleaned],
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 1024,
      stream: true,
      // Nemotron reasoning models: keep thinking off for fast, direct concierge replies.
      extra_body: { chat_template_kwargs: { enable_thinking: false } },
    } as never)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion as AsyncIterable<{
            choices: { delta?: { content?: string | null } }[]
          }>) {
            const token = chunk.choices?.[0]?.delta?.content
            if (token) controller.enqueue(encoder.encode(token))
          }
        } catch {
          controller.enqueue(encoder.encode(''))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.log('[v0] concierge error:', (err as Error).message)
    return NextResponse.json(
      {
        error: 'ai_error',
        message: 'Our concierge is momentarily unavailable. Please try again, or reach us on WhatsApp.',
      },
      { status: 502 },
    )
  }
}
