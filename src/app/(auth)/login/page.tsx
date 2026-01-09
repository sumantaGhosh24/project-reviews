import {requireUnauth} from "@/features/auth/helpers/auth-utils";
import LoginForm from "@/features/auth/components/login-form";

export const metadata = {
  title: "Login",
};

export default async function LoginPage() {
  await requireUnauth();

  return <LoginForm />;
}
