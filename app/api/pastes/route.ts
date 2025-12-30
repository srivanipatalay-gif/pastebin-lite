import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Paste from '../../../lib/models/Paste';

export async function GET() {
  await dbConnect();
  const pastes = await Paste.find({});
  return NextResponse.json(pastes);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const now = new Date();
  const expires_at = body.ttl_seconds ? new Date(now.getTime() + body.ttl_seconds * 1000) : null;
  const remaining_views = body.max_views || null;
  const newPaste = new Paste({
    title: body.title,
    content: body.content,
    language: body.language,
    expires_at,
    remaining_views,
  });
  await newPaste.save();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/p/${newPaste._id}`;
  return NextResponse.json({ ...newPaste.toObject(), url }, { status: 201 });
}