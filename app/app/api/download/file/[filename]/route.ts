
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params
    
    // Forward the request to FastAPI backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/download/file/${filename}`
    )

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: backendResponse.status }
      )
    }

    // Forward the file response
    const fileBlob = await backendResponse.blob()
    
    return new NextResponse(fileBlob, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Download file API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
