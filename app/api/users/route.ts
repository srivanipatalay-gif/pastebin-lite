import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

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

export async function GET() {
  try {
    const db = await connectToDB();
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

    const db = await connectToDB();
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