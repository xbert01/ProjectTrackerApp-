import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Note } from '@/lib/db/models';

// GET all notes (optionally filter by projectId)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const query = projectId ? { projectId } : {};
    const notes = await Note.find(query).sort({ createdAt: -1 });

    return NextResponse.json(notes.map(n => n.toJSON()));
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

// POST create new note
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const now = new Date().toISOString();
    const note = new Note({
      ...body,
      createdAt: now,
      updatedAt: now,
    });

    await note.save();
    return NextResponse.json(note.toJSON(), { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
