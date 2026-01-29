import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Project } from '@/lib/db/models';
import { getCurrentUserId, isCurrentUserManager } from '@/lib/auth-utils';

// GET all projects (filtered by user)
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Managers see all projects, regular users see only their own
    const isManager = await isCurrentUserManager();
    const query = isManager ? {} : { ownerId: userId };

    const projects = await Project.find(query).sort({ createdAt: -1 });
    return NextResponse.json(projects.map(p => p.toJSON()));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();

    const project = new Project({
      ...body,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    });

    await project.save();
    return NextResponse.json(project.toJSON(), { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
