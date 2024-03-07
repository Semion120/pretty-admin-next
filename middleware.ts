import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isAuthCookie = request.cookies.get('isAuth')

  if (path !== '/' && !isAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  } else if (path == '/' && isAuthCookie) {
    // const url = request.nextUrl.clone()
    // url.pathname = '/dashboard'
    // return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
