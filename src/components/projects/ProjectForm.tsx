'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { formatDateForInput } from '@/lib/utils/date';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt' | 'ownerId'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({ project, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [clientName, setClientName] = useState(project?.clientName || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<Project['status']>(project?.status || 'active');
  const [endDate, setEndDate] = useState(
    project?.endDate ? formatDateForInput(project.endDate) : ''
  );
  const [sow, setSow] = useState(project?.links.sow || '');
  const [usabilityGuidelines, setUsabilityGuidelines] = useState(
    project?.links.usabilityGuidelines || ''
  );
  const [githubRepository, setGithubRepository] = useState(
    project?.links.githubRepository || ''
  );
  const [figma, setFigma] = useState(project?.links.figma || '');
  const [feedbackSpreadsheet, setFeedbackSpreadsheet] = useState(
    project?.links.feedbackSpreadsheet || ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit({
      clientName: clientName.trim(),
      description: description.trim(),
      status,
      endDate: endDate || undefined,
      links: {
        sow: sow.trim() || undefined,
        usabilityGuidelines: usabilityGuidelines.trim() || undefined,
        githubRepository: githubRepository.trim() || undefined,
        figma: figma.trim() || undefined,
        feedbackSpreadsheet: feedbackSpreadsheet.trim() || undefined,
      },
      completedAt: project?.completedAt,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        error={errors.clientName}
        placeholder="Enter client name"
        required
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter project description"
        rows={3}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Project['status'])}
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <Input
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Project Links
        </h3>

        <div className="space-y-3">
          <Input
            label="Statement of Work (SOW)"
            value={sow}
            onChange={(e) => setSow(e.target.value)}
            placeholder="https://..."
            type="url"
          />

          <Input
            label="Usability Guidelines"
            value={usabilityGuidelines}
            onChange={(e) => setUsabilityGuidelines(e.target.value)}
            placeholder="https://..."
            type="url"
          />

          <Input
            label="GitHub Repository"
            value={githubRepository}
            onChange={(e) => setGithubRepository(e.target.value)}
            placeholder="https://github.com/..."
            type="url"
          />

          <Input
            label="Figma"
            value={figma}
            onChange={(e) => setFigma(e.target.value)}
            placeholder="https://www.figma.com/..."
            type="url"
          />

          <Input
            label="Feedback Spreadsheet"
            value={feedbackSpreadsheet}
            onChange={(e) => setFeedbackSpreadsheet(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/..."
            type="url"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
