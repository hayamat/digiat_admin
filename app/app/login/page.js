import LoginForm from "@components/auth/LoginForm";

export default function Login() {
  const ADMIN_NAME = process.env.ADMIN_DISPLAY_NAME;
  return (
    <>
      <LoginForm ADMIN_NAME={ADMIN_NAME} />
    </>
  );
}
