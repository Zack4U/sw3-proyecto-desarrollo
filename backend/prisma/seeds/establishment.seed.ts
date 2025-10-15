import { PrismaClient } from '@prisma/client';

export async function seedEstablishments(prisma: PrismaClient) {
  console.log('🏪 Creando establecimientos...');

  const establishments = [
    {
      establishment_id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Panadería El Buen Pan',
      description: 'Panadería artesanal con más de 20 años de experiencia',
      phone: '+34 912 345 678',
      email: 'contacto@elbuenpan.com',
      address: 'Calle Mayor 15, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.7038, 40.4168],
      },
      establishment_type: 'Panadería',
      user_id: 'a23e4567-e89b-12d3-a456-426614174100',
    },
    {
      establishment_id: '223e4567-e89b-12d3-a456-426614174001',
      name: 'Restaurante La Esquina',
      description: 'Restaurante familiar con comida casera',
      phone: '+34 913 456 789',
      email: 'info@laesquina.com',
      address: 'Avenida de la Constitución 42, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6882, 40.4254],
      },
      establishment_type: 'Restaurante',
      user_id: 'a23e4567-e89b-12d3-a456-426614174101',
    },
    {
      establishment_id: '323e4567-e89b-12d3-a456-426614174002',
      name: 'Supermercado Fresh Market',
      description: 'Supermercado con productos frescos y locales',
      phone: '+34 914 567 890',
      email: 'ayuda@freshmarket.com',
      address: 'Plaza del Mercado 8, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.7124, 40.4198],
      },
      establishment_type: 'Supermercado',
      user_id: 'a23e4567-e89b-12d3-a456-426614174102',
    },
    {
      establishment_id: '423e4567-e89b-12d3-a456-426614174003',
      name: 'Cafetería Aroma',
      description: 'Cafetería moderna con wifi y espacio de trabajo',
      phone: '+34 915 678 901',
      email: 'hola@cafeteriaaroma.com',
      address: 'Calle del Prado 23, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6936, 40.4152],
      },
      establishment_type: 'Cafetería',
      user_id: 'a23e4567-e89b-12d3-a456-426614174103',
    },
    {
      establishment_id: '523e4567-e89b-12d3-a456-426614174004',
      name: 'Frutería Los Naranjos',
      description: 'Frutas y verduras frescas de temporada',
      phone: '+34 916 789 012',
      email: 'contacto@losnaranjos.com',
      address: 'Calle de Alcalá 156, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6758, 40.4234],
      },
      establishment_type: 'Frutería',
      user_id: 'a23e4567-e89b-12d3-a456-426614174104',
    },
    {
      establishment_id: '623e4567-e89b-12d3-a456-426614174005',
      name: 'Carnicería Don José',
      description: 'Carnes frescas de calidad premium',
      phone: '+34 917 890 123',
      email: 'info@carniceriadonjose.com',
      address: 'Calle de Serrano 89, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6845, 40.4301],
      },
      establishment_type: 'Carnicería',
      user_id: 'a23e4567-e89b-12d3-a456-426614174105',
    },
    {
      establishment_id: '723e4567-e89b-12d3-a456-426614174006',
      name: 'Pizzería Bella Napoli',
      description: 'Pizzas al estilo napolitano con horno de leña',
      phone: '+34 918 901 234',
      email: 'pedidos@bellanapoli.com',
      address: 'Calle de Bravo Murillo 234, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.7012, 40.4512],
      },
      establishment_type: 'Pizzería',
      user_id: 'a23e4567-e89b-12d3-a456-426614174106',
    },
    {
      establishment_id: '823e4567-e89b-12d3-a456-426614174007',
      name: 'Pastelería Dulce Encanto',
      description: 'Repostería fina y tartas personalizadas',
      phone: '+34 919 012 345',
      email: 'dulce@dulceencanto.com',
      address: 'Calle de Goya 67, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6723, 40.4234],
      },
      establishment_type: 'Pastelería',
      user_id: 'a23e4567-e89b-12d3-a456-426614174107',
    },
  ];

  for (const establishment of establishments) {
    await prisma.establishment.create({
      data: establishment,
    });
  }

  console.log(`   ✅ ${establishments.length} establecimientos creados`);

  return establishments;
}
