
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Forward the request to FastAPI backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/upload/`, {
      method: 'POST',
      body: formData,
    })

    const result = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: result.detail || 'Upload failed' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
