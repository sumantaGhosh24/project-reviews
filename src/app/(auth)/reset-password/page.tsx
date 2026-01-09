import {requireUnauth} from "@/features/auth/helpers/auth-utils";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

export const metadata = {
  title: "Reset Password",
};

export default async function ResetPasswordPage() {
  await requireUnauth();

  return <ResetPasswordForm />;
}
