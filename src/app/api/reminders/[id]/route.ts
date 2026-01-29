import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Reminder } from '@/lib/db/models';

// GET single reminder
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const reminder = await Reminder.findById(params.id);

    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json(reminder.toJSON());
  } catch (error) {
    console.error('Error fetching reminder:', error);
    return NextResponse.json({ error: 'Failed to fetch reminder' }, { status: 500 });
  }
}

// PUT update reminder
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const reminder = await Reminder.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true }
    );

    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json(reminder.toJSON());
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}

// DELETE reminder
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const reminder = await Reminder.findByIdAndDelete(params.id);

    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
  }
}
