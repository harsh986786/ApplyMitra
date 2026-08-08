export const dynamic = 'force-dynamic'; 
import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse } from '@/server/utils';

export async function GET(req: NextRequest) {
  try {
    requireRole(req, 'admin');
    const db = await getDb();
    const [apps, team] = await Promise.all([
      db.collection(COLLECTIONS.APPLICATIONS).find({}).toArray(),
      db.collection(COLLECTIONS.TEAM).find({}).toArray(),
    ]);
    // Revenue is the sum of paidAmount on payment-verified records (dynamic, accurate).
    const applicationRevenue = apps
      .filter((a: any) => a.paymentVerified)
      .reduce((s: number, a: any) => s + (a.paidAmount || 0), 0);
    const teamRevenue = team
      .filter((a: any) => a.paymentVerified)
      .reduce((s: number, a: any) => s + (a.paidAmount || 0), 0);
    return json({
      totalApplications: apps.length,
      pendingApplications: apps.filter((a: any) => a.status === 'pending').length,
      completedApplications: apps.filter((a: any) => a.status === 'completed').length,
      paymentVerifiedApps: apps.filter((a: any) => a.paymentVerified).length,
      totalTeamApplications: team.length,
      pendingTeamApplications: team.filter((a: any) => a.status === 'pending').length,
      applicationRevenue,
      teamRevenue,
      totalRevenue: applicationRevenue + teamRevenue,
    });
  } catch (err) {
    return errorResponse(err, 'Failed to load stats');
  }
}
