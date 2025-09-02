import { NextResponse } from "next/server";
import { VerificationService } from "@/service/verification.service";
import { EmailService } from "@/service/email.service";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const result = await VerificationService.resendVerificationEmail(email);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const emailSent = await EmailService.sendVerificationEmail(email, result.token!);

    if (!emailSent) {
      return NextResponse.json({ success: false, error: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
