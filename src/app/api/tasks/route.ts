import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { Task } from '@/lib/db/models';

// GET all tasks (optionally filter by projectId)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const query = projectId ? { projectId } : {};
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
    await connectToDatabase();
    const body = await request.json();

    const task = new Task({
      ...body,
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
