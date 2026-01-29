import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Note, Project } from '@/lib/db/models';
import { getCurrentUserId, isCurrentUserManager } from '@/lib/auth-utils';

// GET all notes (filtered by user's projects)
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // Get user's project IDs
    const isManager = await isCurrentUserManager();
    const projectQuery = isManager ? {} : { ownerId: userId };
    const userProjects = await Project.find(projectQuery).select('_id');
    const userProjectIds = userProjects.map(p => p._id.toString());

    // Filter notes by user's projects
    let query: any = { projectId: { $in: userProjectIds } };
    if (projectId && userProjectIds.includes(projectId)) {
      query = { projectId };
    }

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
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // Verify user owns the project
    const isManager = await isCurrentUserManager();
    const project = await Project.findById(body.projectId);
    if (!project || (!isManager && project.ownerId !== userId)) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 403 });
    }

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
