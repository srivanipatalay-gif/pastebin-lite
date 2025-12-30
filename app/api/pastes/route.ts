import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

let client: MongoClient;
let db: any;

async function connectToDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    db = client.db(); // default database from URI
  }
  return db;
}

export async function GET() {
  try {
    const db = await connectToDB();
    const collection = db.collection("pastes");
    const pastes = await collection.find({}).toArray();
    return NextResponse.json(pastes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.content) {
      return NextResponse.json({ error: "Content missing" }, { status: 400 });
    }

    const db = await connectToDB();
    const collection = db.collection("pastes");

    const result = await collection.insertOne({
      content: data.content,
      ttl_seconds: data.ttl_seconds || 60,
      max_views: data.max_views || 1,
      title: data.title || 'Untitled',
      language: data.language || 'text',
      createdAt: new Date(),
    });

    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/p/${result.insertedId}`;
    return NextResponse.json({ message: "Paste saved!", id: result.insertedId, url });
  } catch (err) {
    console.error(err); // Vercel logs will show errors
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}