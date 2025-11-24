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

            this.logger.log("📨 Resend response:", response);
            this.logger.log(`Correo de bienvenida enviado a ${to}`);
            return response;

        } catch (error) {
            this.logger.error('Error enviando correo de bienvenida:', error);
            // NO interrumpimos el registro del usuario
            return null;
        }
    }


    async sendPasswordResetEmail(to: string, token: string) { }

    async sendConfirmationEmail(to: string) { }
}
