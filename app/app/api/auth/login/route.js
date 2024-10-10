import db from "@lib/db";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    // ユーザーをメールアドレスで検索
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    console.log(rows);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // パスワードの検証
    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log(isValidPassword);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // JWTの生成
    const token = sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // クライアントにJWTトークンを返す
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Login error:", error); // エラーをログに出力

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
