const MEDIA_BASE_URL = import.meta.env.VITE_API_MEDIA_URL || '';

export function resolveMediaUrl(path) {
  if (!path) return '';

  const value = String(path).trim();
  if (!value) return '';

  if (
    value.startsWith('data:') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('blob:')
  ) {
    return value;
  }

  if (!MEDIA_BASE_URL) {
    return value;
  }

  const normalizedBase = MEDIA_BASE_URL.endsWith('/')
    ? MEDIA_BASE_URL.slice(0, -1)
    : MEDIA_BASE_URL;
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;

  return `${normalizedBase}${normalizedPath}`;
}
