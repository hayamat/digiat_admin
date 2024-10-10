import { useState, useEffect } from "react";

export function useUser() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // クッキーからユーザー名を取得
    const match = document.cookie.match(/username=([^;]*)/);
    if (match) {
      setUsername(decodeURIComponent(match[1]));
    }
  }, []);

  return { username };
}
