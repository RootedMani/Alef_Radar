import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { defaultProductProfiles } from '../data/defaultProfiles';
import { ProductProfile, User } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.resolve(DB_DIR, 'database.json');

export interface StoredUser extends User {
  passwordHash: string;
  resetCode?: string;
  resetCodeExpires?: string;
}

export interface DatabaseSchema {
  users: StoredUser[];
  profiles: ProductProfile[];
  runs: any[];
}

const initialDatabase: DatabaseSchema = {
  users: [
    {
      id: 'user-demo-01',
      email: 'founder@opportunityradar.ai',
      name: 'Sarah Jenkins',
      passwordHash: '$2a$10$wE96c7q5M3P18kS6U6XUvOaW2M.00YqfLp5Lq9xQ3bH6a7pI9w1mO', // bcrypt hash for 'radar123'
      role: 'Founder',
      subscriptionPlan: 'PRO',
      createdAt: '2026-10-07T09:12:31.479Z'
    },
    {
      id: 'user-demo-02',
      email: 'alex@growthscale.io',
      name: 'Alex Rivera',
      passwordHash: '$2a$10$wE96c7q5M3P18kS6U6XUvOaW2M.00YqfLp5Lq9xQ3bH6a7pI9w1mO', // 'brandnewpassword123' / 'radar123'
      role: 'Growth Lead',
      subscriptionPlan: 'ENTERPRISE',
      createdAt: '2026-10-07T09:12:31.480Z'
    },
    {
      id: 'user-mani',
      email: 'manijabaripersonal@gmail.com',
      name: 'Mani Jabari',
      passwordHash: '$2a$10$wE96c7q5M3P18kS6U6XUvOaW2M.00YqfLp5Lq9xQ3bH6a7pI9w1mO', // default 'radar123'
      role: 'Founder',
      subscriptionPlan: 'PRO',
      createdAt: '2026-10-09T12:00:00.000Z'
    }
  ],
  profiles: defaultProductProfiles,
  runs: []
};

/* =========================================================
   MONGOOSE SCHEMAS & MODELS
   ========================================================= */
const UserMongooseSchema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'Member' },
  subscriptionPlan: { type: String, enum: ['FREE', 'PRO', 'ENTERPRISE'], default: 'FREE' },
  resetCode: { type: String },
  resetCodeExpires: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const ProfileMongooseSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Software / SaaS' },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  targetAudience: [{ type: String }],
  painPointsSolved: [{ type: String }],
  keyFeatures: [{ type: String }],
  toneOfVoice: {
    type: String,
    enum: ['empathic_expert', 'friendly_peer', 'consultative', 'direct_builder'],
    default: 'empathic_expert'
  },
  toneDescription: { type: String, default: '' },
  exclusionRules: [{ type: String }],
  exampleHook: { type: String, default: '' },
  pricePoint: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

// Avoid OverwriteModelError in case of hot-reload
export const UserModel = mongoose.models.User || mongoose.model('User', UserMongooseSchema);
export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileMongooseSchema);

export function sanitizeMongoUri(rawUri: string): string {
  let uri = rawUri.trim();
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1);
  }

  const schemeMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
  if (!schemeMatch) return uri;

  const scheme = schemeMatch[1];
  const rest = schemeMatch[2];

  const atIdx = rest.lastIndexOf('@');
  if (atIdx === -1) return uri;

  const credentialsPart = rest.substring(0, atIdx);
  let hostAndPath = rest.substring(atIdx + 1);

  const colonIdx = credentialsPart.indexOf(':');
  if (colonIdx === -1) return uri;

  let user = credentialsPart.substring(0, colonIdx);
  let pass = credentialsPart.substring(colonIdx + 1);

  if (user.startsWith('<') && user.endsWith('>')) {
    user = user.slice(1, -1);
  }
  if (pass.startsWith('<') && pass.endsWith('>')) {
    pass = pass.slice(1, -1);
  }

  const encodedPass = encodeURIComponent(decodeURIComponent(pass));

  if (hostAndPath.includes('/?')) {
    hostAndPath = hostAndPath.replace('/?', '/alef-radar?');
  } else if (!hostAndPath.includes('/')) {
    hostAndPath = hostAndPath + '/alef-radar';
  } else if (hostAndPath.endsWith('/')) {
    hostAndPath = hostAndPath + 'alef-radar';
  }

  return `${scheme}${user}:${encodedPass}@${hostAndPath}`;
}

let isMongoConnected = false;
let mongoInitAttempted = false;

export async function initDatabase(): Promise<void> {
  ensureDbExists();

  const rawMongoUri = process.env.MONGODB_URI;
  if (!rawMongoUri || mongoInitAttempted) return;

  mongoInitAttempted = true;
  mongoose.set('bufferCommands', false); // Fail fast, do not buffer if offline

  const mongoUri = sanitizeMongoUri(rawMongoUri);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log('✅ [MongoDB] Successfully connected to MongoDB Atlas database!');

    // 1. Seed & synchronize user accounts to MongoDB Atlas if not present
    try {
      const local = readDatabase();
      for (const u of local.users) {
        const exists = await UserModel.findOne({ email: u.email.toLowerCase() });
        if (!exists) {
          await UserModel.create({
            id: u.id,
            email: u.email.toLowerCase(),
            name: u.name,
            passwordHash: u.passwordHash,
            role: u.role || 'Member',
            subscriptionPlan: u.subscriptionPlan || 'FREE',
            resetCode: u.resetCode,
            resetCodeExpires: u.resetCodeExpires,
            createdAt: u.createdAt
          });
        }
      }
      console.log('✅ [MongoDB] Synchronized user accounts to MongoDB Atlas.');
    } catch (userSyncErr) {
      console.warn('⚠️ [MongoDB] User sync notice:', userSyncErr);
    }

    // 2. Seed & synchronize product profiles into MongoDB
    try {
      const local = readDatabase();
      const profilesToSync = local.profiles.length > 0 ? local.profiles : defaultProductProfiles;
      for (const p of profilesToSync) {
        const exists = await ProfileModel.findOne({ id: p.id });
        if (!exists) {
          await ProfileModel.create(p);
        }
      }
      console.log('✅ [MongoDB] Synchronized product profiles to MongoDB Atlas.');
    } catch (seedErr) {
      console.warn('⚠️ [MongoDB] Profile seed notice:', seedErr);
    }
  } catch (err: any) {
    isMongoConnected = false;
    console.warn('⚠️ [MongoDB] Connection could not be established. Seamlessly using local JSON database fallback.');
    console.warn('   Reason:', err.message || err);
    if (err.message && (err.message.includes('auth') || err.message.includes('Authentication'))) {
      console.warn('   💡 MongoDB Auth Tip: If your password has special characters like @, #, or %, make sure they are URL-encoded in MONGODB_URI.');
      console.warn('   💡 MongoDB Auth Tip: In MongoDB Atlas, verify your Database User exists under "Database Access" and IP "0.0.0.0/0" is added under "Network Access".');
    }
  }

  mongoose.connection.on('connected', () => {
    isMongoConnected = true;
  });
  mongoose.connection.on('disconnected', () => {
    isMongoConnected = false;
  });
  mongoose.connection.on('error', () => {
    isMongoConnected = false;
  });
}

// Immediately fire initialization
initDatabase().catch(() => {});

export function isUsingMongo(): boolean {
  return isMongoConnected && mongoose.connection.readyState === 1;
}

export function getDatabaseStatus(): {
  provider: 'mongodb' | 'json_storage';
  status: 'connected' | 'fallback_active';
  uriConfigured: boolean;
  userCount: number;
  profileCount: number;
} {
  const localDb = readDatabase();
  const usingMongo = isUsingMongo();

  return {
    provider: usingMongo ? 'mongodb' : 'json_storage',
    status: usingMongo ? 'connected' : 'fallback_active',
    uriConfigured: Boolean(process.env.MONGODB_URI),
    userCount: localDb.users.length,
    profileCount: localDb.profiles.length
  };
}

/* =========================================================
   LOCAL FILE STORAGE (ROBUST PERSISTENT FALLBACK)
   ========================================================= */
function ensureDbExists(): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2), 'utf-8');
  }
}

export function readDatabase(): DatabaseSchema {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || initialDatabase.users,
      profiles: parsed.profiles || initialDatabase.profiles,
      runs: parsed.runs || []
    };
  } catch (err) {
    console.error('Error reading database file, using fallback initial data:', err);
    return initialDatabase;
  }
}

export function writeDatabase(data: DatabaseSchema): void {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

/* =========================================================
   USER AUTHENTICATION CRUD (DUAL COMPATIBLE: MONGO + JSON)
   ========================================================= */
export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const normalizedEmail = email.toLowerCase().trim();

  if (isUsingMongo()) {
    try {
      const doc = await UserModel.findOne({ email: normalizedEmail }).lean();
      if (doc) {
        return {
          id: (doc as any).id,
          email: (doc as any).email,
          name: (doc as any).name,
          role: (doc as any).role,
          subscriptionPlan: (doc as any).subscriptionPlan,
          passwordHash: (doc as any).passwordHash,
          resetCode: (doc as any).resetCode,
          resetCodeExpires: (doc as any).resetCodeExpires,
          createdAt: (doc as any).createdAt
        };
      }
    } catch (err) {
      console.warn('MongoDB findUserByEmail failed, checking local storage:', err);
    }
  }

  const local = readDatabase();
  return local.users.find((u) => u.email.toLowerCase() === normalizedEmail);
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  if (isUsingMongo()) {
    try {
      const doc = await UserModel.findOne({ id }).lean();
      if (doc) {
        return {
          id: (doc as any).id,
          email: (doc as any).email,
          name: (doc as any).name,
          role: (doc as any).role,
          subscriptionPlan: (doc as any).subscriptionPlan,
          passwordHash: (doc as any).passwordHash,
          resetCode: (doc as any).resetCode,
          resetCodeExpires: (doc as any).resetCodeExpires,
          createdAt: (doc as any).createdAt
        };
      }
    } catch (err) {
      console.warn('MongoDB findUserById failed, checking local storage:', err);
    }
  }

  const local = readDatabase();
  return local.users.find((u) => u.id === id);
}

export async function createUser(email: string, password: string, name?: string): Promise<StoredUser> {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = bcrypt.hashSync(password, 10);
  const now = new Date().toISOString();
  const id = `user-${Date.now()}`;

  const newUser: StoredUser = {
    id,
    email: normalizedEmail,
    name: name?.trim() || normalizedEmail.split('@')[0],
    passwordHash,
    role: 'Member',
    subscriptionPlan: 'FREE',
    createdAt: now
  };

  // 1. Save to MongoDB if available
  if (isUsingMongo()) {
    try {
      await UserModel.create({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        passwordHash: newUser.passwordHash,
        role: newUser.role,
        subscriptionPlan: newUser.subscriptionPlan,
        createdAt: newUser.createdAt
      });
    } catch (err) {
      console.warn('MongoDB createUser failed, stored to local fallback:', err);
    }
  }

  // 2. Always persist to local file as robust backup
  const db = readDatabase();
  const existingIdx = db.users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingIdx >= 0) {
    db.users[existingIdx] = newUser;
  } else {
    db.users.push(newUser);
  }
  writeDatabase(db);

  return newUser;
}

export function verifyPassword(plainPassword: string, storedHash: string): boolean {
  if (!storedHash || !plainPassword) return false;
  // Check bcrypt hash
  try {
    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')) {
      return bcrypt.compareSync(plainPassword, storedHash);
    }
  } catch (e) {
    // Ignore error and try plain comparison
  }
  // Fallback for plain text demo accounts (e.g., 'radar123', 'brandnewpassword123')
  return plainPassword === storedHash;
}

export async function updateUserProfile(
  email: string,
  updates: { name?: string; subscriptionPlan?: 'FREE' | 'PRO' | 'ENTERPRISE' }
): Promise<StoredUser | null> {
  const normalizedEmail = email.toLowerCase().trim();

  if (isUsingMongo()) {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.subscriptionPlan !== undefined) updateData.subscriptionPlan = updates.subscriptionPlan;
      await UserModel.updateOne({ email: normalizedEmail }, { $set: updateData });
    } catch (err) {
      console.warn('MongoDB updateUserProfile failed, saving locally:', err);
    }
  }

  const db = readDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) return null;
  if (updates.name !== undefined) user.name = updates.name;
  if (updates.subscriptionPlan !== undefined) user.subscriptionPlan = updates.subscriptionPlan;
  writeDatabase(db);
  return user;
}

export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = bcrypt.hashSync(newPassword, 10);

  if (isUsingMongo()) {
    try {
      await UserModel.updateOne(
        { email: normalizedEmail },
        {
          $set: { passwordHash },
          $unset: { resetCode: 1, resetCodeExpires: 1 }
        }
      );
    } catch (err) {
      console.warn('MongoDB updateUserPassword failed:', err);
    }
  }

  const db = readDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) return false;
  user.passwordHash = passwordHash;
  delete user.resetCode;
  delete user.resetCodeExpires;
  writeDatabase(db);
  return true;
}

export async function setPasswordResetCode(email: string, code: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  if (isUsingMongo()) {
    try {
      await UserModel.updateOne(
        { email: normalizedEmail },
        { $set: { resetCode: code, resetCodeExpires: expires } }
      );
    } catch (err) {
      console.warn('MongoDB setPasswordResetCode failed:', err);
    }
  }

  const db = readDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) return false;
  user.resetCode = code;
  user.resetCodeExpires = expires;
  writeDatabase(db);
  return true;
}

export async function verifyPasswordResetCode(email: string, code: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  if (!user || !user.resetCode || !user.resetCodeExpires) return false;
  if (user.resetCode !== code) return false;
  if (new Date(user.resetCodeExpires).getTime() < Date.now()) return false;
  return true;
}

export async function getAllUsers(): Promise<Omit<StoredUser, 'passwordHash' | 'resetCode'>[]> {
  if (isUsingMongo()) {
    try {
      const docs = await UserModel.find({}).sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          id: d.id,
          email: d.email,
          name: d.name,
          role: d.role || 'Member',
          subscriptionPlan: d.subscriptionPlan || 'FREE',
          createdAt: d.createdAt
        }));
      }
    } catch (err) {
      console.warn('MongoDB getAllUsers failed, falling back to local storage:', err);
    }
  }

  const db = readDatabase();
  return db.users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role || 'Member',
    subscriptionPlan: u.subscriptionPlan || 'FREE',
    createdAt: u.createdAt
  }));
}

/* =========================================================
   PRODUCT PROFILES CRUD (DUAL COMPATIBLE: MONGO + JSON)
   ========================================================= */
export async function getAllProfiles(): Promise<ProductProfile[]> {
  if (isUsingMongo()) {
    try {
      const docs = await ProfileModel.find({}).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          id: d.id,
          name: d.name,
          category: d.category || 'Software / SaaS',
          tagline: d.tagline || '',
          description: d.description || '',
          targetAudience: d.targetAudience || [],
          painPointsSolved: d.painPointsSolved || [],
          keyFeatures: d.keyFeatures || [],
          toneOfVoice: d.toneOfVoice || 'empathic_expert',
          toneDescription: d.toneDescription || '',
          exclusionRules: d.exclusionRules || [],
          exampleHook: d.exampleHook || '',
          pricePoint: d.pricePoint || ''
        }));
      }
    } catch (err) {
      console.warn('MongoDB getAllProfiles failed, falling back to local storage:', err);
    }
  }

  const db = readDatabase();
  return db.profiles && db.profiles.length > 0 ? db.profiles : defaultProductProfiles;
}

export async function saveNewProfile(profile: ProductProfile): Promise<ProductProfile> {
  if (isUsingMongo()) {
    try {
      await ProfileModel.findOneAndUpdate(
        { id: profile.id },
        { $set: profile },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('MongoDB saveNewProfile failed, persisting to local fallback:', err);
    }
  }

  const db = readDatabase();
  const existingIndex = db.profiles.findIndex((p) => p.id === profile.id);
  if (existingIndex >= 0) {
    db.profiles[existingIndex] = profile;
  } else {
    db.profiles.unshift(profile);
  }
  writeDatabase(db);
  return profile;
}

export async function deleteProfile(profileId: string): Promise<boolean> {
  if (isUsingMongo()) {
    try {
      await ProfileModel.deleteOne({ id: profileId });
    } catch (err) {
      console.warn('MongoDB deleteProfile failed:', err);
    }
  }

  const db = readDatabase();
  const initialLength = db.profiles.length;
  db.profiles = db.profiles.filter((p) => p.id !== profileId);
  if (db.profiles.length !== initialLength) {
    writeDatabase(db);
    return true;
  }
  return false;
}
