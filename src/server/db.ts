import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  // Don't throw at module load (breaks builds); throw lazily on first use.
  console.warn('[db] MONGODB_URI is not set — API routes will fail until it is added to .env');
}

const client = new MongoClient(uri || 'mongodb://localhost:27017');
let clientPromise: Promise<MongoClient>;
let dbInstance: Db | null = null;

interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalAny = globalThis as unknown as GlobalWithMongo;

if (!globalAny._mongoClientPromise) {
  globalAny._mongoClientPromise = client.connect();
}
clientPromise = globalAny._mongoClientPromise;

export async function getDb(): Promise<Db> {
  if (dbInstance) return dbInstance;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in .env');
  }
  const client = await clientPromise;
  dbInstance = client.db('applymitra');
  await ensureIndexes(dbInstance);
  await seedServices(dbInstance);
  return dbInstance;
}

export const COLLECTIONS = {
  SERVICES: 'services',
  APPLICATIONS: 'applications',
  TEAM: 'team_applications',
  STAFF: 'staff',
} as const;

async function ensureIndexes(db: Db) {
  await db.collection(COLLECTIONS.SERVICES).createIndex({ slug: 1 }, { unique: true });
  await db.collection(COLLECTIONS.STAFF).createIndex({ email: 1 }, { unique: true });
  await db.collection(COLLECTIONS.APPLICATIONS).createIndex({ createdAt: -1 });
  await db.collection(COLLECTIONS.APPLICATIONS).createIndex({ assignedTo: 1 });
  await db.collection(COLLECTIONS.TEAM).createIndex({ createdAt: -1 });
}

/** Seed a few default services so the UI is not empty on a fresh database. */
async function seedServices(db: Db) {
  const count = await db.collection(COLLECTIONS.SERVICES).countDocuments();
  if (count > 0) return;
  const baseFees = (gov: number) => [
    { category: 'General', governmentFee: gov, convenienceFee: 100 },
    { category: 'OBC', governmentFee: Math.round(gov * 0.9), convenienceFee: 100 },
    { category: 'SC', governmentFee: Math.round(gov * 0.5), convenienceFee: 100 },
    { category: 'ST', governmentFee: Math.round(gov * 0.5), convenienceFee: 100 },
    { category: 'EWS', governmentFee: Math.round(gov * 0.8), convenienceFee: 100 },
    {category: 'PH', governmentFee: Math.round(gov * 0.5), convenienceFee: 100 },
  ];
  await db.collection(COLLECTIONS.SERVICES).insertMany([
    {
      name: 'PAN Card Application',
      slug: 'pan-card-application',
      category: 'Certificate',
      description: 'Permanent Account Number (PAN) card application — new, correction or reprint. Our expert submits your form and tracks it until delivered.',
      eligibility: 'Any Indian citizen. For minors, parent/guardian details required.',
      documentsRequired: 'Aadhaar card, photo, proof of address, date of birth proof.',
      fees: baseFees(107),
      createdAt: new Date(),
    },
    {
      name: 'SSC CGL Exam Form',
      slug: 'ssc-cgl-exam-form',
      category: 'Exam',
      description: 'Staff Selection Commission Combined Graduate Level exam registration. Complete form filling including photo/sign upload and fee payment.',
      eligibility: 'Graduate from a recognised university. Age 18-32 (category relaxations apply).',
      documentsRequired: 'Graduation certificate, photo, signature, category certificate (if applicable).',
      fees: baseFees(100),
      createdAt: new Date(),
    },
    {
      name: 'Aadhaar Update / Correction',
      slug: 'aadhaar-update-correction',
      category: 'Government Scheme',
      description: 'Update name, address, mobile number or biometrics on your Aadhaar card.',
      eligibility: 'Any Aadhaar holder.',
      documentsRequired: 'Aadhaar card, proof of the detail being updated.',
      fees: baseFees(50),
      createdAt: new Date(),
    },
    {
      name: 'Railway Recruitment (RRB) Form',
      slug: 'railway-recruitment-rrb-form',
      category: 'Job',
      description: 'Railway Recruitment Board application forms for various technical and non-technical posts.',
      eligibility: 'Varies by post — 10th, ITI or graduate. Age 18-33 (relaxations apply).',
      documentsRequired: 'Educational certificates, photo, signature, community certificate.',
      fees: baseFees(500),
      createdAt: new Date(),
    },
    {
      name: 'Income & Caste Certificate',
      slug: 'income-caste-certificate',
      category: 'Certificate',
      description: 'Apply for an income certificate or caste certificate through your state government.',
      eligibility: 'Resident of the state. Caste certificate requires valid community proof.',
      documentsRequired: 'Aadhaar, ration card, parent caste certificate, income proof.',
      fees: baseFees(40),
      createdAt: new Date(),
    },
    {
      name: 'Scholarship Application',
      slug: 'scholarship-application',
      category: 'Government Scheme',
      description: 'Pre-matric, post-matric and merit-cum-means scholarship forms for students.',
      eligibility: 'Students meeting the scheme income and category criteria.',
      documentsRequired: 'Mark sheets, income certificate, caste certificate, bank details, Aadhaar.',
      fees: baseFees(60),
      createdAt: new Date(),
    },
  ]);
}
