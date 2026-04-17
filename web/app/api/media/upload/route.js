import fs from 'node:fs/promises';
import path from 'node:path';
import { jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { requireAuth } from '@/lib/auth-api.js';
import { publicUploadUrlFromRequest } from '@/lib/server/utils/publicUrlNext.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

export async function POST(request) {
  try {
    const denied = requireAuth(request, ['admin']);
    if (denied instanceof Response) return denied;
    if (env.skipDatabaseBootstrap) return jsonError('Database is not configured', 503);
    await ensureDbReady();
    const formData = await request.formData();
    const file = formData.get('image');
    if (!file || typeof file === 'string') {
      return jsonError('No image uploaded', 400);
    }
    if (!file.type.startsWith('image/')) {
      return jsonError('Only image uploads are allowed', 400);
    }
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const safeName = String(file.name || 'image').replace(/\s+/g, '-');
    const filename = `${Date.now()}-${safeName}`;
    await fs.writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
    const url = publicUploadUrlFromRequest(request, filename);
    return jsonSuccess({ url, filename }, 'Image uploaded', 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
