import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pastebin-lite");
    const collection = db.collection("users");
    const users = await collection.find({}).toArray();
    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Name missing" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pastebin-lite");
    const collection = db.collection("users");

    const result = await collection.insertOne({
      name: body.name,
      createdAt: new Date(),
    });

    return NextResponse.json({ _id: result.insertedId, name: body.name }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}