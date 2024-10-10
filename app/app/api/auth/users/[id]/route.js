import db from "@lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req, { params }) {
  const { id } = params; // URLパラメータからユーザーIDを取得

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; // URLパラメータからユーザーIDを取得

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id } = params; // URLパラメータからユーザーIDを取得
  const { name, email, password, role } = await req.json();

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  if (!name && !email && !password && !role) {
    return NextResponse.json(
      {
        message:
          "At least one field (name, email, password, or role) is required",
      },
      { status: 400 }
    );
  }

  try {
    // 更新するフィールドを動的に組み立てる
    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (password) {
      // パスワードをハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }
    if (role) {
      // ロールが有効な値かチェック
      const validRoles = ["Master", "Admin", "Editor", "Viewer"];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
      }
      fields.push("role = ?");
      values.push(role);
    }

    // updated_atフィールドを現在のタイムスタンプに更新
    fields.push("updated_at = NOW()");

    // クエリを組み立てて実行
    const [result] = await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
