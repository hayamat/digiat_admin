import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // '/users' または '/users/'で始まるすべてのパスに対してチェック
  if (pathname.startsWith("/users")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // トークンの検証
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      return NextResponse.next(); // トークンが有効な場合は通過
    } catch (error) {
      console.error("トークン検証エラー:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next(); // その他のパスはそのまま通過
}

export const config = {
  matcher: ["/users/:path*"], // '/users'以下のすべてのパスに適用
};
