import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignUp({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const session = await getServerSession(authOptions);

  const params = await searchParams;

  if (session) {
    const callbackUrl = params?.callbackUrl;
    callbackUrl ? redirect(callbackUrl) : redirect("/");
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
