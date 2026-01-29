import { StorageAdapter } from '@/types';
import { encrypt, decrypt, getEncryptionSecret } from './encryption';

const SENSITIVE_KEYS = ['notes'];

class LocalStorageAdapter implements StorageAdapter {
  private async shouldEncrypt(key: string): Promise<boolean> {
    return SENSITIVE_KEYS.includes(key);
  }

  private async save(key: string, data: unknown[]): Promise<void> {
    if (typeof window === 'undefined') return;

    const jsonData = JSON.stringify(data);

    if (await this.shouldEncrypt(key)) {
      const secret = getEncryptionSecret();
      const encrypted = await encrypt(jsonData, secret);
      localStorage.setItem(key, encrypted);
    } else {
      localStorage.setItem(key, jsonData);
    }
  }

  private async load<T>(key: string): Promise<T[]> {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(key);
    if (!stored) return [];

    try {
      if (await this.shouldEncrypt(key)) {
        const secret = getEncryptionSecret();
        const decrypted = await decrypt(stored, secret);
        return JSON.parse(decrypted);
      }
      return JSON.parse(stored);
    } catch {
      console.error(`Failed to load ${key} from localStorage`);
      return [];
    }
  }

  async getAll<T>(key: string): Promise<T[]> {
    return this.load<T>(key);
  }

  async getById<T extends { id: string }>(key: string, id: string): Promise<T | null> {
    const items = await this.load<T>(key);
    return items.find((item) => item.id === id) || null;
  }

  async create<T extends { id: string }>(key: string, item: T): Promise<T> {
    const items = await this.load<T>(key);
    items.push(item);
    await this.save(key, items);
    return item;
  }

  async update<T extends { id: string }>(
    key: string,
    id: string,
    updates: Partial<T>
  ): Promise<T> {
    const items = await this.load<T>(key);
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Item with id ${id} not found in ${key}`);
    }

    const updated = { ...items[index], ...updates };
    items[index] = updated;
    await this.save(key, items);
    return updated;
  }

  async delete(key: string, id: string): Promise<void> {
    const items = await this.load<{ id: string }>(key);
    const filtered = items.filter((item) => item.id !== id);
    await this.save(key, filtered);
  }

  async clear(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  async bulkDelete(key: string, ids: string[]): Promise<void> {
    const items = await this.load<{ id: string }>(key);
    const filtered = items.filter((item) => !ids.includes(item.id));
    await this.save(key, filtered);
  }

  async bulkSave<T>(key: string, items: T[]): Promise<void> {
    await this.save(key, items);
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
