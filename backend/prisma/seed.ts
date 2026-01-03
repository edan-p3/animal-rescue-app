import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const passwordHash = await bcrypt.hash('Password123', 12);

  const maria = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      email: 'maria@example.com',
      passwordHash,
      name: 'Maria Rodriguez',
      role: 'rescuer',
      phone: '+1234567890',
      organization: 'City Animal Rescue',
      isActive: true,
    },
  });

  const drChen = await prisma.user.upsert({
    where: { email: 'chen@example.com' },
    update: {},
    create: {
      email: 'chen@example.com',
      passwordHash,
      name: 'Dr. Chen',
      role: 'vet',
      phone: '+1234567891',
      organization: 'Downtown Vet Clinic',
      isActive: true,
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      passwordHash,
      name: 'Sarah Johnson',
      role: 'foster',
      phone: '+1234567892',
      isActive: true,
    },
  });

  console.log('✅ Created sample users');

  // Create sample cases
  const case1 = await prisma.case.create({
    data: {
      species: 'dog',
      description: 'Brown labrador mix, friendly, approximately 2 years old',
      status: 'at_vet',
      urgency: 'high',
      locationFound: '123 Main St, Downtown',
      locationFoundGeneral: 'Downtown Area',
      locationCurrent: 'Downtown Vet Clinic',
      dateRescued: new Date('2026-01-02T10:30:00Z'),
      conditionDescription: 'Injured leg, limping',
      injuries: 'Possible fracture on right hind leg',
      behaviorNotes: 'Calm and friendly with people',
      publicNotes: 'Surgery scheduled for tomorrow. Recovery expected to take 2 weeks.',
      isPublic: true,
      primaryOwnerId: maria.id,
    },
  });

  const case2 = await prisma.case.create({
    data: {
      species: 'cat',
      description: 'Orange tabby, very shy',
      status: 'at_foster',
      urgency: 'medium',
      locationFound: 'Park Street',
      locationFoundGeneral: 'Park Area',
      locationCurrent: 'Sarah\'s Home',
      dateRescued: new Date('2025-12-28T14:00:00Z'),
      conditionDescription: 'Malnourished, needs regular feeding',
      publicNotes: 'Recovering well in foster care. Starting to trust people.',
      isPublic: true,
      primaryOwnerId: maria.id,
    },
  });

  const case3 = await prisma.case.create({
    data: {
      species: 'dog',
      description: 'Small terrier mix, found with collar',
      status: 'adoption_talks',
      urgency: 'low',
      locationFound: '5th Avenue',
      locationFoundGeneral: '5th Avenue Area',
      locationCurrent: 'Sarah\'s Home',
      dateRescued: new Date('2025-12-20T09:00:00Z'),
      conditionDescription: 'Healthy, well-groomed',
      publicNotes: 'Potential adopter coming for visit this weekend!',
      isPublic: true,
      primaryOwnerId: sarah.id,
    },
  });

  console.log('✅ Created sample cases');

  // Add collaborators
  await prisma.caseCollaborator.create({
    data: {
      caseId: case1.id,
      userId: drChen.id,
      addedBy: maria.id,
      roleLabel: 'Veterinarian',
    },
  });

  await prisma.caseCollaborator.create({
    data: {
      caseId: case2.id,
      userId: sarah.id,
      addedBy: maria.id,
      roleLabel: 'Foster',
    },
  });

  console.log('✅ Added collaborators');

  // Add activity logs
  await prisma.activityLog.create({
    data: {
      caseId: case1.id,
      userId: maria.id,
      actionType: 'case_created',
      description: 'Case created',
      isPublic: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      caseId: case1.id,
      userId: maria.id,
      actionType: 'status_change',
      description: 'Changed status to At Vet',
      isPublic: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      caseId: case1.id,
      userId: drChen.id,
      actionType: 'note_added',
      description: 'Examined dog. X-rays show hairline fracture. Surgery recommended.',
      isPublic: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      caseId: case2.id,
      userId: maria.id,
      actionType: 'case_created',
      description: 'Case created',
      isPublic: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      caseId: case2.id,
      userId: sarah.id,
      actionType: 'note_added',
      description: 'Cat is eating well and gaining weight. Still hiding but making progress.',
      isPublic: true,
    },
  });

  console.log('✅ Added activity logs');

  console.log('🎉 Database seed completed!');
  console.log('\n📝 Sample credentials:');
  console.log('  Email: maria@example.com');
  console.log('  Email: chen@example.com');
  console.log('  Email: sarah@example.com');
  console.log('  Password (all): Password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

