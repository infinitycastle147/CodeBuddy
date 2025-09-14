import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    // Log the token for debugging
    console.log('🔑 JWT Token retrieved (payload):', {
      sub: token.sub,
      email: token.email,
      id: token.id,
      username: token.username,
      iat: token.iat,
      exp: token.exp
    })

    // Get the raw JWT token string from the request cookies
    const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                         request.cookies.get('__Secure-next-auth.session-token')?.value
    
    if (sessionToken) {
      console.log('🔗 Raw JWT Token String:', sessionToken)
    }

    // Return the raw JWT string for API authentication
    // We'll create a new JWT string from the token data
    const jwtPayload = {
      sub: token.sub || token.id,
      email: token.email,
      id: token.id,
      username: token.username,
      isVerified: token.isVerified,
      iat: token.iat,
      exp: token.exp
    }

    return NextResponse.json({ 
      token: jwtPayload,
      rawToken: sessionToken,
      sessionToken: token.sub || token.id
    })

  } catch (error) {
    console.error('Error retrieving JWT token:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve token' },
      { status: 500 }
    )
  }
}