// pages/dashboard.js または app/dashboard/page.js
import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">ダッシュボード</span>
            </div>
            <div className="flex space-x-6">
              <a
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                ホーム
              </a>
              <a href="/forms" className="text-gray-500 hover:text-gray-700">
                フォーム一覧
              </a>
              <a href="/records" className="text-gray-500 hover:text-gray-700">
                レコード一覧
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          ようこそ、ダッシュボードへ
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium mb-2">フォーム一覧</h2>
            <p className="text-gray-600 mb-4">
              既存のフォームを管理・閲覧できます。
            </p>
            <a href="/forms" className="text-blue-500 hover:underline">
              フォームを表示
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium mb-2">レコード管理</h2>
            <p className="text-gray-600 mb-4">
              作成されたレコードの管理や検索が可能です。
            </p>
            <a href="/records" className="text-blue-500 hover:underline">
              レコードを管理
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium mb-2">新しいフォームを作成</h2>
            <p className="text-gray-600 mb-4">
              新しいフォームを作成してカスタマイズしましょう。
            </p>
            <a href="/forms/new" className="text-blue-500 hover:underline">
              フォームを作成
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
