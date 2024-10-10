import mysql from "mysql2/promise";

// データベース接続のプールを作成
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // ポート番号を追加
  waitForConnections: true,
  connectionLimit: 10, // 必要に応じて調整
  queueLimit: 0,
});

export default connection;
