import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { EmailService } from "./email.service";

export class PasswordService {
  static async generateResetToken(email: string) {
    // Проверяем существует ли пользователь с таким email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Для безопасности не сообщаем, что пользователь не существует
      return true;
    }

    // Генерируем токен
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 час

    // Удаляем старые токены для этого email
    await prisma.passwordResetToken.deleteMany({
      where: { identifier: email },
    });

    // Создаем новый токен
    await prisma.passwordResetToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 4px; 
            margin: 20px 0; 
          }
          .footer { 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #eee; 
            color: #666; 
            font-size: 14px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Сброс пароля</h2>
          <p>Вы запросили сброс пароля для вашего аккаунта.</p>
          <a href="${resetLink}" class="button">Сбросить пароль</a>
          <p>Или скопируйте эту ссылку в браузер:</p>
          <p><code>${resetLink}</code></p>
          <p>Ссылка действительна в течение 1 часа.</p>
          <div class="footer">
            <p>Если вы не запрашивали сброс пароля, проигнорируйте это письмо.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await EmailService.sendEmail({
      to: email,
      subject: "Сброс пароля",
      html,
    });

    return true;
  }

  static async validateResetToken(token: string) {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    if (!resetToken) {
      return { valid: false, error: "Неверный токен" };
    }

    if (resetToken.expires < new Date()) {
      // Удаляем просроченный токен
      await prisma.passwordResetToken.deleteMany({
        where: { token },
      });
      return { valid: false, error: "Токен истек" };
    }

    return { valid: true, email: resetToken.identifier };
  }

  static async resetPassword(token: string, newPassword: string) {
    const validation = await this.validateResetToken(token);

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const { email } = validation;

    if (!email) {
      return { success: false, error: "Неверный токен" };
    }

    const { hash } = await import("bcryptjs");
    const hashedPassword = await hash(newPassword, 12);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Пользователь не найден" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.deleteMany({
      where: { token },
    });

    return { success: true };
  }

  static async cleanupExpiredTokens() {
    const now = new Date();
    await prisma.passwordResetToken.deleteMany({
      where: {
        expires: {
          lt: now,
        },
      },
    });
  }
}

setInterval(() => PasswordService.cleanupExpiredTokens(), 5 * 60 * 1000);
