import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  // ==========================
  // 🔹 PLANTILLA: Bienvenida
  // ==========================
  private welcomeTemplate(username: string) {
    return `
      <div style="font-family: Arial; padding: 20px;">
        <h1 style="color:#2e7d32;">¡Bienvenido a ComiYA, ${username}!</h1>
        <p>Tu cuenta ha sido creada exitosamente.</p>
        <p>Gracias por unirte a nuestra comunidad.</p>
        <br>
        <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} ComiYA</p>
      </div>
    `;
  }

  // ==========================
  // 🔹 PLANTILLA: Recuperación
  // ==========================
  private passwordResetTemplate(resetUrl: string) {
    return `
      <div style="font-family: Arial; padding: 20px;">
        <h2 style="color:#1565c0;">Recuperación de contraseña</h2>
        <p>Has solicitado recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>

        <a href="${resetUrl}" 
           style="background:#1976d2; color:white; padding:10px 15px; text-decoration:none; border-radius:4px;">
          Restablecer contraseña
        </a>

        <br><br>
        <p>Este enlace expirará en 10 minutos.</p>
        <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} ComiYA</p>
      </div>
    `;
  }

  // ==========================
  // 🔹 PLANTILLA: Confirmación
  // ==========================
  private confirmationTemplate() {
    return `
      <div style="font-family: Arial; padding: 20px;">
        <h1 style="color:#2e7d32;">¡Correo confirmado!</h1>
        <p>Tu dirección de correo ha sido verificada exitosamente.</p>
        <p>Ya puedes continuar usando la plataforma sin restricciones.</p>
        <br>
        <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} ComiYA</p>
      </div>
    `;
  }

  // ======================================================
  // 📩 MÉTODOS PARA ENVIAR LOS CORREOS
  // ======================================================

  async sendWelcomeEmail(to: string, username: string) {
    try {
      const html = this.welcomeTemplate(username);

      const response = await this.resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject: 'Bienvenido a ComiYA',
        html,
      } as any);

      this.logger.log(`📨 Welcome email sent to ${to}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending welcome email:', error);
      return null;
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      const html = this.passwordResetTemplate(resetUrl);

      const response = await this.resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject: 'Recuperación de contraseña',
        html,
      } as any);

      this.logger.log(`📨 Password reset email sent to ${to}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending reset email:', error);
      return null;
    }
  }

  async sendConfirmationEmail(to: string) {
    try {
      const html = this.confirmationTemplate();

      const response = await this.resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to,
        subject: 'Confirmación de acción',
        html,
      } as any);

      this.logger.log(`📨 Confirmation email sent to ${to}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending confirmation email:', error);
      return null;
    }
  }
}
