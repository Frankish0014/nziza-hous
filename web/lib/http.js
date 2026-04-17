import { NextResponse } from 'next/server';

export function jsonSuccess(data, message = 'OK', status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function jsonError(message, status = 500, details) {
  const body = { success: false, message };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

export async function validateRequest(schema, payload) {
  try {
    await schema.validateAsync(payload, { abortEarly: false, allowUnknown: true });
    return null;
  } catch (err) {
    return jsonError('Validation error', 400, err.details?.map((d) => d.message) || []);
  }
}
