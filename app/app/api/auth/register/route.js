import db from "@lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, email, password } = await req.json();

  try {
    // 既に同じメールアドレスが登録されているか確認
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "このメールアドレスは既に使用されています" },
        { status: 400 }
      );
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新しいユーザーを作成
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [
        name,
        email,
        hashedPassword,
        "Editor", // 初期の登録は通常ユーザーとする
      ]
    );

    return NextResponse.json({ message: "ユーザー登録が成功しました" });
  } catch (error) {
    console.error("登録エラー:", error);
    return NextResponse.json(
      { message: "内部エラーが発生しました" },
      { status: 500 }
    );
  }
}
