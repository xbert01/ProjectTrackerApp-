import { Project, Task, Note, Reminder, User } from '@/types';

interface MigrationContext {
  projects: Project[];
  tasks: Task[];
  notes: Note[];
  reminders: Reminder[];
  users: User[];
}

type Migration = {
  version: number;
  name: string;
  migrate: (data: MigrationContext) => MigrationContext;
};

const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial',
    migrate: (data) => data,
  },
];

const SCHEMA_VERSION_KEY = 'schema_version';

export function getCurrentSchemaVersion(): number {
  if (typeof window === 'undefined') return 0;
  const version = localStorage.getItem(SCHEMA_VERSION_KEY);
  return version ? parseInt(version, 10) : 0;
}

export function setSchemaVersion(version: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SCHEMA_VERSION_KEY, version.toString());
}

export function getLatestVersion(): number {
  return migrations[migrations.length - 1]?.version || 0;
}

export function runMigrations(data: MigrationContext): MigrationContext {
  const currentVersion = getCurrentSchemaVersion();
  const latestVersion = getLatestVersion();

  if (currentVersion >= latestVersion) {
    return data;
  }

  let migratedData = { ...data };

  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`Running migration: ${migration.name} (v${migration.version})`);
      migratedData = migration.migrate(migratedData);
    }
  }

  setSchemaVersion(latestVersion);
  return migratedData;
}
