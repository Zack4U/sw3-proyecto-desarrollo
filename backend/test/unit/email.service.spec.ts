import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../src/notifications/email.service';
import { Resend } from 'resend';

jest.mock('resend', () => {
    return {
        Resend: jest.fn().mockImplementation(() => {
            return {
                emails: {
                    send: jest.fn(),
                },
            };
        }),
    };
});


describe('EmailService', () => {
    let service: EmailService;
    let resendInstance: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmailService],
        }).compile();

        service = module.get<EmailService>(EmailService);

        // obtener instancia real usada por el servicio
        resendInstance = (service as any).resend;
    });


    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // =============================
    //      WELCOME EMAIL
    // =============================
    describe('sendWelcomeEmail', () => {
        it('should send welcome email successfully', async () => {
            const to = 'test@example.com';
            const username = 'John';
            const mockResponse = { data: { id: '123' } };

            resendInstance.emails.send.mockResolvedValue(mockResponse);

            const result = await service.sendWelcomeEmail(to, username);

            expect(result).toEqual(mockResponse);
            expect(resendInstance.emails.send).toHaveBeenCalledTimes(1);

            const call = resendInstance.emails.send.mock.calls[0][0];

            expect(call.to).toBe(to);
            expect(call.subject).toBe('Bienvenido a ComiYA');
            expect(call.html).toContain('¡Bienvenido a ComiYA, John!');
        });

        it('should handle errors in welcome email', async () => {
            const to = 'test@example.com';
            const username = 'John';

            resendInstance.emails.send.mockRejectedValue(new Error('Send error'));

            const result = await service.sendWelcomeEmail(to, username);

            expect(result).toBeNull();
            expect(resendInstance.emails.send).toHaveBeenCalledTimes(1);
        });
    });

    // =============================
    //   PASSWORD RESET EMAIL
    // =============================
    describe('sendPasswordResetEmail', () => {
        it('should send password reset email successfully', async () => {
            const to = 'reset@test.com';
            const token = 'abcd1234';
            const mockResponse = { data: { id: '456' } };

            process.env.FRONTEND_URL = 'http://localhost:8081';

            resendInstance.emails.send.mockResolvedValue(mockResponse);

            const result = await service.sendPasswordResetEmail(to, token);

            expect(result).toEqual(mockResponse);
            expect(resendInstance.emails.send).toHaveBeenCalledTimes(1);

            const call = resendInstance.emails.send.mock.calls[0][0];

            expect(call.to).toBe(to);
            expect(call.subject).toBe('Recuperación de contraseña');
            expect(call.html).toContain('Has solicitado recuperar tu contraseña');
            expect(call.html).toContain(
                `http://localhost:8081/reset-password?token=${token}`,
            );
        });

        it('should handle errors in password reset email', async () => {
            const to = 'reset@test.com';
            const token = 'abcd1234';

            resendInstance.emails.send.mockRejectedValue(new Error('Send error'));

            const result = await service.sendPasswordResetEmail(to, token);

            expect(result).toBeNull();
            expect(resendInstance.emails.send).toHaveBeenCalledTimes(1);
        });
    });

    // =============================
    //     CONFIRMATION EMAIL
    // =============================
    describe('sendConfirmationEmail', () => {
        it('should send confirmation email successfully', async () => {
            const to = 'confirm@test.com';
            const mockResponse = { data: { id: '789' } };

            resendInstance.emails.send.mockResolvedValue(mockResponse);

            const result = await service.sendConfirmationEmail(to);

            expect(result).toEqual(mockResponse);
            expect(resendInstance.emails.send).toHaveBeenCalledTimes(1);

            const call = resendInstance.emails.send.mock.calls[0][0];
            expect(call.to).toBe(to);
            expect(call.subject).toBe('Confirmación de acción');
            expect(call.html).toContain('¡Correo confirmado!');
        });

        it('should handle errors in confirmation email', async () => {
            const to = 'confirm@test.com';

            resendInstance.emails.send.mockRejectedValue(new Error('Send error'));

            const result = await service.sendConfirmationEmail(to);

            expect(result).toBeNull();
            expect(resendInstance.emails.send).toHaveBeenCalledTimes(1);
        });
    });
});
