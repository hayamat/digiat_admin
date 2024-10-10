import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // クッキーからトークンを取得
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "未認証" }, { status: 401 });
    }

    // トークンの検証
    verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ message: "認証成功" });
  } catch (error) {
    console.error("トークン検証エラー:", error);
    return NextResponse.json({ message: "無効なトークン" }, { status: 401 });
  }
}
