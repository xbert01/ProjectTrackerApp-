const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

async function getKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('project-tracker-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(data: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(data)
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode.apply(null, Array.from(combined)));
}

export async function decrypt(encrypted: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));

  const iv = combined.slice(0, IV_LENGTH);
  const data = combined.slice(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

export function getEncryptionSecret(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || 'default-secret-change-me';
  }
  return process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || 'default-secret-change-me';
}
