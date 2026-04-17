import fs from 'node:fs/promises';
import path from 'node:path';
import { jsonSuccess, jsonError } from '@/lib/http.js';
import { handleRouteError } from '@/lib/handleRouteError.js';
import { publicUploadUrlFromRequest } from '@/lib/server/utils/publicUrlNext.js';
import { ensureDbReady } from '@/lib/server/ensureDb.js';
import { env } from '@/lib/server/config/env.js';

const allowedMime = (t) => t.startsWith('image/') || t === 'application/pdf';

export async function POST(request) {
  try {
    if (env.skipDatabaseBootstrap) {
      return jsonError('Database is not configured', 503);
    }
    await ensureDbReady();
    const formData = await request.formData();
    const file = formData.get('proof');
    if (!file || typeof file === 'string') {
      return jsonError('No payment proof uploaded', 400);
    }
    if (!allowedMime(file.type)) {
      return jsonError('Only image or PDF uploads are allowed', 400);
    }
    if (file.size > 5 * 1024 * 1024) {
      return jsonError('Uploaded file is too large', 400);
    }
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const safeName = String(file.name || 'proof').replace(/\s+/g, '-');
    const filename = `${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    const url = publicUploadUrlFromRequest(request, filename);
    return jsonSuccess({ url }, 'Payment proof uploaded', 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
