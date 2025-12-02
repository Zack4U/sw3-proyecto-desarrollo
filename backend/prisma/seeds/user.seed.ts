import { PrismaClient, UserRole, DocumentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';


export async function seedUsers(prisma: PrismaClient) {
  console.log('👥 Creando usuarios...');

  const users = [
    {
      userId: 'a23e4567-e89b-12d3-a456-426614174100',
      username: 'panaderia_buen_pan',
      email: 'contacto@elbuenpan.com',
      phone: '+34 912 345 678',
      documentNumber: '12345678A',
      documentType: DocumentType.CC,
      role: UserRole.ESTABLISHMENT,
      isVerified: true,
      isActive: true,
    },
    {
      userId: 'a23e4567-e89b-12d3-a456-426614174101',
      username: 'restaurante_esquina',
      email: 'info@laesquina.com',
      phone: '+34 913 456 789',
      documentNumber: '23456789B',
      documentType: DocumentType.CC,
      role: UserRole.ESTABLISHMENT,
      isVerified: true,
      isActive: true,
    },
    {
      userId: 'a23e4567-e89b-12d3-a456-426614174102',
      username: 'fresh_market',
      email: 'ayuda@freshmarket.com',
      phone: '+34 914 567 890',
      documentNumber: '34567890C',
      documentType: DocumentType.CC,
      role: UserRole.ESTABLISHMENT,
      isVerified: true,
      isActive: true,
    },
    {
      userId: 'a23e4567-e89b-12d3-a456-426614174103',
      username: 'cafeteria_aroma',
      email: 'hola@cafeteriaaroma.com',
      phone: '+34 915 678 901',
      documentNumber: '45678901D',
      documentType: DocumentType.CC,
      role: UserRole.ESTABLISHMENT,
      isVerified: true,
      isActive: true,
    },
    {
      userId: 'a23e4567-e89b-12d3-a456-426614174104',
      username: 'los_naranjos',
      email: 'contacto@losnaranjos.com',
      phone: '+34 916 789 012',
      documentNumber: '56789012E',
      documentType: DocumentType.CC,
      role: UserRole.ESTABLISHMENT,
      isVerified: true,
      isActive: true,
    },
    {
      userId: 'a23e4567-e89b-12d3-a456-426614174105',
      username: 'carniceria_donjose',
      email: 'info@carniceriadonjose.com',
      phone: '+34 917 890 123',
      documentNumber: '67890123F',
      documentType: DocumentType.CC,
      role: UserRole.ESTABLISHMENT,
      isVerified: true,
      isActive: true,
    },
    {
      userId: 'a23e4567-e89b-12d3-a456-426614174106',
      username: 'bella_napoli',
      email: 'pedidos@bellanapoli.com',
      phone: '+34 918 901 234',
      documentNumber: '78901234G',
      documentType: DocumentType.CC,
      role: UserRole.ESTABLISHMENT,
      isVerified: true,
      isActive: true,
    },
    {
      userId: 'a23e4567-e89b-12d3-a456-426614174107',
      username: 'dulce_encanto',
      email: 'dulce@dulceencanto.com',
      phone: '+34 919 012 345',
      documentNumber: '89012345H',
      documentType: DocumentType.CC,
      role: UserRole.ESTABLISHMENT,
      isVerified: true,
      isActive: true,
    },
    {
      userId: 'b23e4567-e89b-12d3-a456-426614174200',
      username: 'beneficiario_prueba',
      email: 'beneficiario@comiya.com',
      phone: '+57 300 123 4567',
      documentNumber: '99999999Z',
      documentType: DocumentType.CC,
      role: UserRole.BENEFICIARY,
      isVerified: true,
      isActive: true,
      password: await bcrypt.hash('password', 10),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(`   ✅ ${users.length} usuarios creados`);

  return users;
}
