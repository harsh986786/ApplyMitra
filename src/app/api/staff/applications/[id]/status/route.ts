import { NextRequest } from 'next/server';
import { getDb, COLLECTIONS } from '@/server/db';
import { requireRole } from '@/server/auth';
import { json, errorResponse, readBody } from '@/server/utils';
import { ObjectId } from 'mongodb';
import { sendTelegramAlert } from '@/lib/telegram';
// Staff updates the status of an application assigned to them
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(req, 'staff');
    const db = await getDb();
    const body = await readBody(req);
    const app = await db.collection(COLLECTIONS.APPLICATIONS).findOne({ _id: new ObjectId(params.id) });
    if (!app) return json({ error: 'Application not found' }, 404);
    if (!app.assignedTo || app.assignedTo.toString() !== session.uid) {
      return json({ error: 'Not assigned to you' }, 403);
    }
    await db.collection(COLLECTIONS.APPLICATIONS).updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status: body.status, statusNote: body.note || '', updatedAt: new Date() } }
    );
    if (body.status === 'completed' || body.status === 'rejected') {
      const staffmember = await db.collection(COLLECTIONS.TEAM).findOne({ _id: new ObjectId(session.uid) });
      const staffName = staffmember ? staffmember.name : 'Staff';
      const alertMsg = `<b>Application ${body.status === 'completed' ? 'Completed' : 'Rejected'}</b>\n\nName: ${app.applicantName}\nService: ${app.serviceName}\nPhone: ${app.phone}\nEmail: ${app.email}\nDate: ${new Date().toLocaleDateString()}\n\nThe application has been marked as ${body.status} by the staff.`;
      await sendTelegramAlert(alertMsg);
    }
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err, 'Failed to update status');
  }
}
