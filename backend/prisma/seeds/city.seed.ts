import { City, PrismaClient } from '@prisma/client';

export async function seedCities(prisma: PrismaClient) {
  console.log('🏙️  Creando ciudades capitales de Colombia...');

  // Obtener todos los departamentos
  const departments = await prisma.department.findMany();

  // Mapeo de departamentos y sus capitales
  const departmentCityMap: Record<string, string> = {
    Amazonas: 'Leticia',
    Antioquia: 'Medellín',
    Arauca: 'Arauca',
    Atlántico: 'Barranquilla',
    Bolívar: 'Cartagena',
    Boyacá: 'Tunja',
    Caldas: 'Manizales',
    Caquetá: 'Florencia',
    Cauca: 'Popayán',
    Cesar: 'Valledupar',
    Chocó: 'Quibdó',
    Córdoba: 'Montería',
    Cundinamarca: 'Bogotá',
    Guainía: 'Puerto Inírida',
    Guaviare: 'San José del Guaviare',
    Huila: 'Neiva',
    'La Guajira': 'Riohacha',
    Magdalena: 'Santa Marta',
    Meta: 'Villavicencio',
    Nariño: 'Pasto',
    'Norte de Santander': 'Cúcuta',
    Putumayo: 'Mocoa',
    Quindío: 'Armenia',
    Risaralda: 'Pereira',
    'San Andrés y Providencia': 'San Andrés',
    Santander: 'Bucaramanga',
    Sucre: 'Sincelejo',
    Tolima: 'Ibagué',
    'Valle del Cauca': 'Cali',
    Vaupés: 'Mitú',
    Vichada: 'Puerto Carreño',
  };

  const createdCities: City[] = [];

  for (const department of departments) {
    const cityName = departmentCityMap[department.name];
    if (cityName) {
      const city = await prisma.city.create({
        data: {
          name: cityName,
          departmentId: department.departmentId,
        },
      });
      createdCities.push(city);
    }
  }

  console.log(`   ✅ ${createdCities.length} ciudades creadas`);

  return createdCities;
}
