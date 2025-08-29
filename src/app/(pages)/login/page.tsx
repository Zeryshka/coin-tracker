import { SignInForm } from "@/components/sign-in-form";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
}
