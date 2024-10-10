import UserEditForm from "@components/auth/UserEditForm";

export default function UserEditPage({ params }) {
  const userId = params.id; // URLの[id]からユーザーIDを取得

  if (!userId) {
    return <div>ユーザーIDが指定されていません。</div>;
  }

  return (
    <div>
      <UserEditForm userId={userId} />
    </div>
  );
}
