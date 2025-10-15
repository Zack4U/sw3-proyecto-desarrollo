import { PrismaClient } from '@prisma/client';
import { seedEstablishments } from './seeds/establishment.seed';
import { seedFoods } from './seeds/food.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');
  console.log('='.repeat(50));

  try {
    // Limpiar datos existentes
    console.log('\n🧹 Limpiando datos existentes...');
    await prisma.food.deleteMany({});
    console.log('   ✓ Alimentos eliminados');
    await prisma.establishment.deleteMany({});
    console.log('   ✓ Establecimientos eliminados');

    console.log('\n' + '='.repeat(50));

    // Ejecutar seeds por entidad
    await seedEstablishments(prisma);

    console.log('');

    await seedFoods(prisma);

    console.log('\n' + '='.repeat(50));

    // Contar registros creados
    const establishmentCount = await prisma.establishment.count();
    const foodCount = await prisma.food.count();

    console.log('\n📊 Resumen del seed:');
    console.log(`   - ${establishmentCount} establecimientos creados`);
    console.log(`   - ${foodCount} alimentos creados`);
    console.log(`   - Total de registros: ${establishmentCount + foodCount}`);

    console.log('\n✨ Seed completado exitosamente!');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
