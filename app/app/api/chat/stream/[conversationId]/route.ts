
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { conversationId } = params
    const body = await request.json()

    // Forward the streaming request to FastAPI backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/chat/stream/${conversationId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!backendResponse.ok) {
      const error = await backendResponse.text()
      return NextResponse.json(
        { error: error || 'Chat request failed' },
        { status: backendResponse.status }
      )
    }

    // Return the streaming response
    return new NextResponse(backendResponse.body, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Chat stream API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
