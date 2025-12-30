import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Paste from '../../../../lib/models/Paste';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;

  const now = process.env.TEST_MODE === '1' && req.headers.get('x-test-now-ms')
    ? new Date(Number(req.headers.get('x-test-now-ms')))
    : new Date();

  const paste = await Paste.findById(id);
  if (!paste) {
    return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
  }

  // Check TTL
  if (paste.expires_at && now > new Date(paste.expires_at)) {
    return NextResponse.json({ error: 'Paste expired' }, { status: 404 });
  }

  // Check view limit
  if (paste.remaining_views !== null && paste.remaining_views <= 0) {
    return NextResponse.json({ error: 'Paste view limit exceeded' }, { status: 404 });
  }

  // Reduce remaining_views if applicable
  if (paste.remaining_views !== null) {
    paste.remaining_views -= 1;
    await paste.save();
  }

  return NextResponse.json(paste);
}