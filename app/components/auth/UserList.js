"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Skeletonコンポーネントの作成
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-2">
      <div className="h-4 bg-gray-300 rounded w-8"></div>
    </td>
    <td className="py-2">
      <div className="h-4 bg-gray-300 rounded w-32"></div>
    </td>
    <td className="py-2">
      <div className="h-4 bg-gray-300 rounded w-48"></div>
    </td>
    <td className="py-2">
      <div className="h-4 bg-gray-300 rounded w-16"></div>
    </td>
    <td className="py-2">
      <div className="h-4 bg-gray-300 rounded w-24"></div>
    </td>
    <td className="py-2">
      <div className="h-4 bg-gray-300 rounded w-20"></div>
    </td>
  </tr>
);

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を追加
  const router = useRouter(); // Next.jsのルーターを使用

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/auth/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "ユーザーの取得に失敗しました");
        }
      } catch (error) {
        console.error("ユーザー取得エラー:", error);
        setError("ネットワークエラーが発生しました");
      } finally {
        setLoading(false); // ローディング終了
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = () => {
    // クライアントサイドでのみ実行
    router.push("/users/create");
  };

  const handleEdit = (userId) => {
    router.push(`/users/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    if (!confirm("このユーザーを削除してもよろしいですか？")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        const errorData = await response.json();
        setError(errorData.message || "ユーザーの削除に失敗しました");
      }
    } catch (error) {
      console.error("削除エラー:", error);
      setError("ネットワークエラーが発生しました");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">ユーザー一覧</h2>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCreate}
          >
            新規作成
          </button>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-left">ID</th>
              <th className="py-2 text-left">名前</th>
              <th className="py-2 text-left">メールアドレス</th>
              <th className="py-2 text-left">ロール</th>
              <th className="py-2 text-left">作成日</th>
              <th className="py-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              : users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="py-2">{user.id}</td>
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.role}</td>
                    <td className="py-2">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                        onClick={() => handleEdit(user.id)}
                      >
                        更新
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => handleDelete(user.id)}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
