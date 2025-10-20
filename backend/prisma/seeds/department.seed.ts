import { PrismaClient, Department } from '@prisma/client';

export async function seedDepartments(prisma: PrismaClient) {
  console.log('🗺️  Creando departamentos de Colombia...');

  const departments = [
    'Amazonas',
    'Antioquia',
    'Arauca',
    'Atlántico',
    'Bolívar',
    'Boyacá',
    'Caldas',
    'Caquetá',
    'Cauca',
    'Cesar',
    'Chocó',
    'Córdoba',
    'Cundinamarca',
    'Guainía',
    'Guaviare',
    'Huila',
    'La Guajira',
    'Magdalena',
    'Meta',
    'Nariño',
    'Norte de Santander',
    'Putumayo',
    'Quindío',
    'Risaralda',
    'San Andrés y Providencia',
    'Santander',
    'Sucre',
    'Tolima',
    'Valle del Cauca',
    'Vaupés',
    'Vichada',
  ];

   const createdDepartments: Department[] = [];

  for (const name of departments) {
    const department = await prisma.department.create({
      data: { name },
    });
    createdDepartments.push(department);
  }

  console.log(`   ✅ ${createdDepartments.length} departamentos creados`);

  return createdDepartments;
}
