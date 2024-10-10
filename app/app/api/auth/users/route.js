import db from "@lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ユーザー情報を全て取得
    const [rows] = await db.query(
      "SELECT id, name, email, role, created_at FROM users"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("ユーザー取得エラー:", error);
    return NextResponse.json(
      { message: "ユーザーの取得に失敗しました" },
      { status: 500 }
    );
  }
}
