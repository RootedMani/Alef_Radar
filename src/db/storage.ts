import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
      passwordHash: 'radar123',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-demo-02',
      email: 'alex@growthscale.io',
      name: 'Alex Rivera',
      passwordHash: 'scale2026',
      createdAt: new Date().toISOString()
    }
  ],
  profiles: defaultProductProfiles,
  runs: []
};

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

// User Helpers
export function findUserByEmail(email: string): StoredUser | undefined {
  const db = readDatabase();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email: string, password: string, name?: string): StoredUser {
  const db = readDatabase();
  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    passwordHash: password,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  writeDatabase(db);
  return newUser;
}

export function updateUserProfile(
  email: string,
  updates: { name?: string; subscriptionPlan?: 'FREE' | 'PRO' | 'ENTERPRISE' }
): StoredUser | null {
  const db = readDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  if (updates.name !== undefined) user.name = updates.name;
  if (updates.subscriptionPlan !== undefined) user.subscriptionPlan = updates.subscriptionPlan;
  writeDatabase(db);
  return user;
}

export function updateUserPassword(email: string, newPassword: string): boolean {
  const db = readDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return false;
  user.passwordHash = newPassword;
  delete user.resetCode;
  delete user.resetCodeExpires;
  writeDatabase(db);
  return true;
}

export function setPasswordResetCode(email: string, code: string): boolean {
  const db = readDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return false;
  user.resetCode = code;
  // 15 minutes expiration
  user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  writeDatabase(db);
  return true;
}

export function verifyPasswordResetCode(email: string, code: string): boolean {
  const db = readDatabase();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.resetCode || !user.resetCodeExpires) return false;
  if (user.resetCode !== code) return false;
  if (new Date(user.resetCodeExpires).getTime() < Date.now()) return false;
  return true;
}

// Profile Helpers
export function getAllProfiles(): ProductProfile[] {
  const db = readDatabase();
  return db.profiles;
}

export function saveNewProfile(profile: ProductProfile): ProductProfile {
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
