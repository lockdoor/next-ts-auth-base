export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard/:path*"] }

// import { NextRequest, NextResponse } from "next/server";
// import {getToken} from 'next-auth/jwt'
// import { roleCheck } from '@/controller/user'

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl
//   // console.log("pathname => ", pathname)
//   const protectedPaths = ['/dashboard']
//   const matchesProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))
//   if(matchesProtectedPath){
//     const token = await getToken({req})
//     console.log("protectedPaths => ", pathname)
//     console.log('token is => ', token)
//     if(!token){
//       const url = new URL('/auth/signin', req.url)
//       url.searchParams.set("callbackUrl", encodeURI(req.url));
//       return NextResponse.redirect(url)
//     }
//     const role = await roleCheck(token.email as string)
//     switch(role){
//       case 'admin' : 
//     }

//   }
//   return NextResponse.next()
// }