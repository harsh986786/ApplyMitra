import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';

const STAFF_COOKIE = 'applymitra_staff';
const ADMIN_COOKIE = 'applymitra_admin';

function getSecret(): string {
  return process.env.SESSION_SECRET || 'applymitra-secret';
}

function sign(data: string): string {
  return crypto.createHmac('sha256', getSecret()).update(data).digest('hex');
}

function createToken(userId: string, role: string): string {
  const payload = { uid: userId, role, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

function verifyToken(token: string): { uid: string; role: string } | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  if (sign(body) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (data.exp < Date.now()) return null;
    return { uid: data.uid, role: data.role };
  } catch {
    return null;
  }
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return verify === hash;
}

export function setSessionCookie(res: any, role: 'admin' | 'staff', userId: string, name: string, email: string) {
  const token = createToken(userId, role);
  const cookieName = role === 'admin' ? ADMIN_COOKIE : STAFF_COOKIE;
  res.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  // also expose a readable meta cookie for the client to know name/role without the secret token
  res.cookies.set('applymitra_meta', JSON.stringify({ role, name, email }), {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookies(res: any) {
  [ADMIN_COOKIE, STAFF_COOKIE, 'applymitra_meta'].forEach((c) => {
    res.cookies.set(c, '', { httpOnly: c !== 'applymitra_meta', sameSite: 'lax', path: '/', maxAge: 0 });
  });
}

export function getSession(req: NextRequest): { uid: string; role: string } | null {
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;
  const staffToken = req.cookies.get(STAFF_COOKIE)?.value;
  const token = adminToken || staffToken;
  if (!token) return null;
  return verifyToken(token);
}

export function requireRole(req: NextRequest, role: 'admin' | 'staff') {
  const session = getSession(req);
  if (!session) throw { status: 401, message: 'Unauthorized' };
  if (session.role !== role) throw { status: 403, message: 'Forbidden' };
  return session;
}
