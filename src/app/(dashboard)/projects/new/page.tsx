'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useProjects();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Parameters<typeof createProject>[0]) => {
    setIsLoading(true);
    try {
      const project = await createProject(data);
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create New Project
      </h1>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Details
          </h2>
        </CardHeader>
        <CardContent>
          <ProjectForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
