import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendWelcomeEmail(to: string, username: string) {
        try {
            const html = `
      <h1>¡Bienvenido a ComiYA, ${username}!</h1>
      <p>Tu cuenta ha sido creada exitosamente.</p>
    `;

            const response = await this.resend.emails.send({
                from: process.env.EMAIL_FROM,
                to,
                subject: 'Bienvenido a ComiYA',
                html,
            } as any);

            this.logger.log(`Correo de bienvenida enviado a ${to}`);
            return response;

        } catch (error) {
            this.logger.error('Error enviando correo de bienvenida:', error);
            // NO interrumpimos el registro del usuario
            return null;
        }
    }


    async sendPasswordResetEmail(to: string, token: string) {
        try {
            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8081'}/reset-password?token=${token}`;

            const html = `
      <h2>Recuperación de contraseña</h2>
      <p>Has solicitado recuperar tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetUrl}">Restablecer contraseña</a>
      <br/><br/>
      <p>Este enlace expirará en 10 minutos.</p>
    `;

            const response = await this.resend.emails.send({
                from: process.env.EMAIL_FROM!,
                to,
                subject: 'Recuperación de contraseña',
                html,
            } as any);


            this.logger.log(`Correo de recuperación enviado a ${to}`);
            return response;

        } catch (error) {
            this.logger.error("Error enviando correo de recuperación:", error);
            return null;
        }
    }


    async sendConfirmationEmail(to: string) {
        try {
            const html = `
    <h1>¡Gracias por confirmar tu correo!</h1>
    <p>Tu dirección de correo ha sido verificada exitosamente.</p>
  `;

            const response = await this.resend.emails.send({
                from: process.env.EMAIL_FROM!,
                to,
                subject: 'Confirmación de correo',
                html,
            } as any);

            this.logger.log(`Correo de confirmación enviado a ${to}`);
            return response;

        } catch (error) {
            this.logger.error("Error enviando correo de confirmación:", error);
            return null;
        }
    }
}