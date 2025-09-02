import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  static async sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

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
          <h2>Подтвердите ваш email</h2>
          <p>Спасибо за регистрацию! Для завершения процесса, пожалуйста, подтвердите ваш email адрес.</p>
          <a href="${confirmLink}" class="button">Подтвердить Email</a>
          <p>Или скопируйте эту ссылку в браузер:</p>
          <p><code>${confirmLink}</code></p>
          <div class="footer">
            <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: "Подтвердите ваш email",
      html,
    });
  }

  static async sendEmail(options: EmailOptions) {
    try {
      const { data, error } = await resend.emails.send({
        from: "PORPHY <noreply@welcome.porphy.ru>",
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        console.error("Error sending email:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Email service error:", error);
      return false;
    }
  }
}
