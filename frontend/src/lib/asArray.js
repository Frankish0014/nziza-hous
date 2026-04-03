/** Safe list for API payloads that should be arrays but may be missing or malformed in production. */
export function asArray(value) {
  return Array.isArray(value) ? value : [];
}
