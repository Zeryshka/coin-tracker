import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SignIn({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const session = await getServerSession(authOptions);

  const params = await searchParams;

  if (session) {
    const callbackUrl = params?.callbackUrl;
    callbackUrl ? redirect(callbackUrl) : redirect("/");
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
}
