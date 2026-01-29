import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Reminder, Project } from '@/lib/db/models';
import { getCurrentUserId, isCurrentUserManager } from '@/lib/auth-utils';

// GET all reminders (filtered by user's projects)
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

    // Filter reminders by user's projects (or no project)
    let query: any = {
      $or: [
        { projectId: { $in: userProjectIds } },
        { projectId: { $exists: false } },
        { projectId: null }
      ]
    };
    if (projectId && userProjectIds.includes(projectId)) {
      query = { projectId };
    }

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
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    // If projectId provided, verify user owns the project
    if (body.projectId) {
      const isManager = await isCurrentUserManager();
      const project = await Project.findById(body.projectId);
      if (!project || (!isManager && project.ownerId !== userId)) {
        return NextResponse.json({ error: 'Project not found or access denied' }, { status: 403 });
      }
    }

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
