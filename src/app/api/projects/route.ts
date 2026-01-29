import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Project } from '@/lib/db/models';

// GET all projects
export async function GET() {
  try {
    await connectToDatabase();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects.map(p => p.toJSON()));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const project = new Project({
      ...body,
      ownerId: body.ownerId || 'mock-user-id',
      createdAt: new Date().toISOString(),
    });

    await project.save();
    return NextResponse.json(project.toJSON(), { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
