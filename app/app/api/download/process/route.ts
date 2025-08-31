
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to FastAPI backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/download/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const result = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: result.detail || 'Processing failed' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Process API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
