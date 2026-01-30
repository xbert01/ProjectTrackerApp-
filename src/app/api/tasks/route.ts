import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Task, Project } from '@/lib/db/models';
import { getCurrentUserId, isCurrentUserManager } from '@/lib/auth-utils';

// GET all tasks (filtered by user's projects + user's general tasks)
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const isManager = await isCurrentUserManager();

    if (isManager) {
      // Managers see all tasks
      const query = projectId ? { projectId } : {};
      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return NextResponse.json(tasks.map(t => t.toJSON()));
    }

    // Get user's project IDs
    const userProjects = await Project.find({ ownerId: userId }).select('_id');
    const userProjectIds = userProjects.map(p => p._id.toString());

    // Filter: user's project tasks OR user's general tasks (no projectId)
    let query: any;
    if (projectId) {
      // Specific project requested
      if (userProjectIds.includes(projectId)) {
        query = { projectId };
      } else {
        return NextResponse.json([]);
      }
    } else {
      // All tasks: from user's projects OR owned by user (general tasks)
      query = {
        $or: [
          { projectId: { $in: userProjectIds } },
          { ownerId: userId, projectId: { $exists: false } },
          { ownerId: userId, projectId: null },
          { ownerId: userId, projectId: '' }
        ]
      };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    return NextResponse.json(tasks.map(t => t.toJSON()));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST create new task
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

    const task = new Task({
      ...body,
      ownerId: userId,
      projectId: body.projectId || undefined,
      status: body.status || 'todo',
      createdAt: new Date().toISOString(),
    });

    await task.save();
    return NextResponse.json(task.toJSON(), { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
