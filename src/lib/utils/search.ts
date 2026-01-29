import Fuse from 'fuse.js';
import { Project, Task, Note, SearchResult } from '@/types';

interface SearchableItem {
  type: 'project' | 'task' | 'note';
  id: string;
  title: string;
  subtitle?: string;
  projectId?: string;
  searchText: string;
}

export function createSearchIndex(
  projects: Project[],
  tasks: Task[],
  notes: Note[]
): Fuse<SearchableItem> {
  const items: SearchableItem[] = [
    ...projects.map((p) => ({
      type: 'project' as const,
      id: p.id,
      title: p.clientName,
      subtitle: p.description,
      searchText: `${p.clientName} ${p.description}`,
    })),
    ...tasks.map((t) => {
      const project = projects.find((p) => p.id === t.projectId);
      return {
        type: 'task' as const,
        id: t.id,
        title: t.title,
        subtitle: project?.clientName,
        projectId: t.projectId,
        searchText: `${t.title} ${project?.clientName || ''}`,
      };
    }),
    ...notes.map((n) => {
      const project = projects.find((p) => p.id === n.projectId);
      return {
        type: 'note' as const,
        id: n.id,
        title: n.content.substring(0, 100),
        subtitle: project?.clientName,
        projectId: n.projectId,
        searchText: `${n.content} ${project?.clientName || ''}`,
      };
    }),
  ];

  return new Fuse(items, {
    keys: ['searchText', 'title', 'subtitle'],
    threshold: 0.3,
    includeScore: true,
  });
}

export function search(
  fuse: Fuse<SearchableItem>,
  query: string,
  limit = 10
): SearchResult[] {
  if (!query.trim()) return [];

  const results = fuse.search(query, { limit });

  return results.map((r) => ({
    type: r.item.type,
    id: r.item.id,
    title: r.item.title,
    subtitle: r.item.subtitle,
    projectId: r.item.projectId,
  }));
}

export function filterByType(
  results: SearchResult[],
  type: 'project' | 'task' | 'note'
): SearchResult[] {
  return results.filter((r) => r.type === type);
}
