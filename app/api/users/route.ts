import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const newUser = new User({ name: body.name });
  await newUser.save();
  return NextResponse.json(newUser, { status: 201 });
}