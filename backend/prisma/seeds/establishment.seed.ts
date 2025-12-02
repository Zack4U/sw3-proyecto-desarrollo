import { PrismaClient, EstablishmentType } from '@prisma/client';

export async function seedEstablishments(prisma: PrismaClient) {
  console.log('🏪 Creando establecimientos...');

  // Obtener ciudades para asignar a los establecimientos
  const bogota = await prisma.city.findFirst({
    where: { name: 'Bogotá' },
  });
  const medellin = await prisma.city.findFirst({
    where: { name: 'Medellín' },
  });
  const cali = await prisma.city.findFirst({
    where: { name: 'Cali' },
  });
  const barranquilla = await prisma.city.findFirst({
    where: { name: 'Barranquilla' },
  });

  if (!bogota || !medellin || !cali || !barranquilla) {
    throw new Error('Las ciudades deben ser creadas antes de los establecimientos');
  }

  const establishments = [
    {
      establishmentId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Panadería El Buen Pan',
      description: 'Panadería artesanal con más de 20 años de experiencia',
      address: 'Calle 72 #10-34',
      neighborhood: 'Chapinero',
      location: {
        type: 'Point',
        coordinates: [-74.0639, 4.6533],
      },
      establishmentType: EstablishmentType.BAKERY,
      userId: 'a23e4567-e89b-12d3-a456-426614174100',
      cityId: bogota.cityId,
    },
    {
      establishmentId: '223e4567-e89b-12d3-a456-426614174001',
      name: 'Restaurante La Esquina',
      description: 'Restaurante familiar con comida casera',
      address: 'Carrera 15 #85-23',
      neighborhood: 'Usaquén',
      location: {
        type: 'Point',
        coordinates: [-74.0303, 4.6945],
      },
      establishmentType: EstablishmentType.RESTAURANT,
      userId: 'a23e4567-e89b-12d3-a456-426614174101',
      cityId: bogota.cityId,
    },
    {
      establishmentId: '323e4567-e89b-12d3-a456-426614174002',
      name: 'Supermercado Fresh Market',
      description: 'Supermercado con productos frescos y locales',
      address: 'Calle 50 #43-21',
      neighborhood: 'El Poblado',
      location: {
        type: 'Point',
        coordinates: [-75.5636, 6.2088],
      },
      establishmentType: EstablishmentType.SUPERMARKET,
      userId: 'a23e4567-e89b-12d3-a456-426614174102',
      cityId: medellin.cityId,
    },
    {
      establishmentId: '423e4567-e89b-12d3-a456-426614174003',
      name: 'Cafetería Aroma',
      description: 'Cafetería moderna con wifi y espacio de trabajo',
      address: 'Avenida 9 Norte #15-25',
      neighborhood: 'Granada',
      location: {
        type: 'Point',
        coordinates: [-76.5393, 3.4516],
      },
      establishmentType: EstablishmentType.COFFEE_SHOP,
      userId: 'a23e4567-e89b-12d3-a456-426614174103',
      cityId: cali.cityId,
    },
    {
      establishmentId: '523e4567-e89b-12d3-a456-426614174004',
      name: 'Frutería Los Naranjos',
      description: 'Frutas y verduras frescas de temporada',
      address: 'Calle 93 #47-65',
      neighborhood: 'El Prado',
      location: {
        type: 'Point',
        coordinates: [-74.7847, 10.9985],
      },
      establishmentType: EstablishmentType.FRUIT_SHOP,
      userId: 'a23e4567-e89b-12d3-a456-426614174104',
      cityId: barranquilla.cityId,
    },
    {
      establishmentId: '623e4567-e89b-12d3-a456-426614174005',
      name: 'Carnicería Don José',
      description: 'Carnes frescas de calidad premium',
      address: 'Calle 116 #7-15',
      neighborhood: 'Santa Bárbara',
      location: {
        type: 'Point',
        coordinates: [-74.0373, 4.6972],
      },
      establishmentType: EstablishmentType.BUTCHER_SHOP,
      userId: 'a23e4567-e89b-12d3-a456-426614174105',
      cityId: bogota.cityId,
    },
    {
      establishmentId: '723e4567-e89b-12d3-a456-426614174006',
      name: 'Pizzería Bella Napoli',
      description: 'Pizzas al estilo napolitano con horno de leña',
      address: 'Carrera 70 #104-35',
      neighborhood: 'Laureles',
      location: {
        type: 'Point',
        coordinates: [-75.5947, 6.2451],
      },
      establishmentType: EstablishmentType.RESTAURANT,
      userId: 'a23e4567-e89b-12d3-a456-426614174106',
      cityId: medellin.cityId,
    },
    {
      establishmentId: '823e4567-e89b-12d3-a456-426614174007',
      name: 'Pastelería Dulce Encanto',
      description: 'Repostería fina y tartas personalizadas',
      address: 'Avenida 6 #23-45',
      neighborhood: 'San Fernando',
      location: {
        type: 'Point',
        coordinates: [-76.5225, 3.3703],
      },
      establishmentType: EstablishmentType.BAKERY,
      userId: 'a23e4567-e89b-12d3-a456-426614174107',
      cityId: cali.cityId,
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
