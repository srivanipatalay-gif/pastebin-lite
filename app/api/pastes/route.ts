import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pastebin-lite");
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

    const client = await clientPromise;
    const db = client.db("pastebin-lite");
    const collection = db.collection("pastes");

    const now = new Date();
    const expires_at = data.ttl_seconds ? new Date(now.getTime() + data.ttl_seconds * 1000) : null;
    const remaining_views = data.max_views || null;

    const result = await collection.insertOne({
      content: data.content,
      ttl_seconds: data.ttl_seconds || 60,
      max_views: data.max_views || 1,
      title: data.title || 'Untitled',
      language: data.language || 'text',
      expires_at,
      remaining_views,
      createdAt: new Date(),
    });

    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/p/${result.insertedId}`;
    return NextResponse.json({ message: "Paste saved!", id: result.insertedId, url });
  } catch (err) {
    console.error(err); // Vercel logs will show errors
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}