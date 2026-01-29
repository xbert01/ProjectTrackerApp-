import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Reminder } from '@/lib/db/models';

// GET all reminders
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const query = projectId ? { projectId } : {};
    const reminders = await Reminder.find(query).sort({ triggerDate: 1 });

    return NextResponse.json(reminders.map(r => r.toJSON()));
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

// POST create new reminder
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const reminder = new Reminder({
      ...body,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    await reminder.save();
    return NextResponse.json(reminder.toJSON(), { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}
