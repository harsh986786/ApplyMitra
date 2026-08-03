import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { verifyPassword, setSessionCookie } from '@/server/auth';
import { readBody, errorResponse } from '@/server/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await readBody(req);
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    // Admin: credentials come from environment variables (never stored in DB, never client-visible)
    if (adminEmail && adminPass && email === adminEmail) {
      if (password !== adminPass) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
      const res = NextResponse.json({ role: 'admin', name: 'Harsh Keshri', email: adminEmail });
      setSessionCookie(res, 'admin', 'admin', 'Harsh Keshri', adminEmail);
      return res;
    }

    // Staff: stored in DB
    const db = await getDb();
    const staff = await db.collection(COLLECTIONS.STAFF).findOne({ email });
    if (!staff || !verifyPassword(password, staff.hash, staff.salt)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const res = NextResponse.json({ role: 'staff', name: staff.name, email: staff.email });
    setSessionCookie(res, 'staff', staff._id.toString(), staff.name, staff.email);
    return res;
  } catch (err) {
    return errorResponse(err, 'Login failed');
  }
}
