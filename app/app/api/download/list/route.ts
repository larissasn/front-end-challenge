
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    // Forward the request to FastAPI backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/download/list`)

    const result = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: result.detail || 'Failed to list files' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('List files API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
