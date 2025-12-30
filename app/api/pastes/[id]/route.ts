import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

let client: MongoClient;
let db: any;

async function connectToDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    db = client.db();
  }
  return db;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const now = process.env.TEST_MODE === '1' && req.headers.get('x-test-now-ms')
      ? new Date(Number(req.headers.get('x-test-now-ms')))
      : new Date();

    const db = await connectToDB();
    const collection = db.collection("pastes");
    const paste = await collection.findOne({ _id: new ObjectId(id) });

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
      await collection.updateOne({ _id: new ObjectId(id) }, { $inc: { remaining_views: -1 } });
    }

    return NextResponse.json(paste);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}