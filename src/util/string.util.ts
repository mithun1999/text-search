export function getNameFromUrl(url: string) {
  const a = url.split('?')[0].split('/');
  return a[a.length - 1];
}

export function getSlugFromName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
