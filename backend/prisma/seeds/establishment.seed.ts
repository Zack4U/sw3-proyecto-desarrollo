import { PrismaClient, EstablishmentType } from '@prisma/client';

export async function seedEstablishments(prisma: PrismaClient) {
  console.log('🏪 Creando establecimientos...');

  const establishments = [
    {
      establishmentId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Panadería El Buen Pan',
      description: 'Panadería artesanal con más de 20 años de experiencia',
      address: 'Calle Mayor 15, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.7038, 40.4168],
      },
      establishmentType: EstablishmentType.PANADERIA,
      userId: 'a23e4567-e89b-12d3-a456-426614174100',
    },
    {
      establishmentId: '223e4567-e89b-12d3-a456-426614174001',
      name: 'Restaurante La Esquina',
      description: 'Restaurante familiar con comida casera',
      address: 'Avenida de la Constitución 42, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6882, 40.4254],
      },
      establishmentType: EstablishmentType.RESTAURANTE,
      userId: 'a23e4567-e89b-12d3-a456-426614174101',
    },
    {
      establishmentId: '323e4567-e89b-12d3-a456-426614174002',
      name: 'Supermercado Fresh Market',
      description: 'Supermercado con productos frescos y locales',
      address: 'Plaza del Mercado 8, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.7124, 40.4198],
      },
      establishmentType: EstablishmentType.SUPERMERCADO,
      userId: 'a23e4567-e89b-12d3-a456-426614174102',
    },
    {
      establishmentId: '423e4567-e89b-12d3-a456-426614174003',
      name: 'Cafetería Aroma',
      description: 'Cafetería moderna con wifi y espacio de trabajo',
      address: 'Calle del Prado 23, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6936, 40.4152],
      },
      establishmentType: EstablishmentType.CAFETERIA,
      userId: 'a23e4567-e89b-12d3-a456-426614174103',
    },
    {
      establishmentId: '523e4567-e89b-12d3-a456-426614174004',
      name: 'Frutería Los Naranjos',
      description: 'Frutas y verduras frescas de temporada',
      address: 'Calle de Alcalá 156, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6758, 40.4234],
      },
      establishmentType: EstablishmentType.FRUTERIA,
      userId: 'a23e4567-e89b-12d3-a456-426614174104',
    },
    {
      establishmentId: '623e4567-e89b-12d3-a456-426614174005',
      name: 'Carnicería Don José',
      description: 'Carnes frescas de calidad premium',
      address: 'Calle de Serrano 89, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6845, 40.4301],
      },
      establishmentType: EstablishmentType.CARNICERIA,
      userId: 'a23e4567-e89b-12d3-a456-426614174105',
    },
    {
      establishmentId: '723e4567-e89b-12d3-a456-426614174006',
      name: 'Pizzería Bella Napoli',
      description: 'Pizzas al estilo napolitano con horno de leña',
      address: 'Calle de Bravo Murillo 234, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.7012, 40.4512],
      },
      establishmentType: EstablishmentType.RESTAURANTE,
      userId: 'a23e4567-e89b-12d3-a456-426614174106',
    },
    {
      establishmentId: '823e4567-e89b-12d3-a456-426614174007',
      name: 'Pastelería Dulce Encanto',
      description: 'Repostería fina y tartas personalizadas',
      address: 'Calle de Goya 67, Madrid',
      location: {
        type: 'Point',
        coordinates: [-3.6723, 40.4234],
      },
      establishmentType: EstablishmentType.RESTAURANTE,
      userId: 'a23e4567-e89b-12d3-a456-426614174107',
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
