export const minimumSearchLength = 2;
export const maximumSearchLength = 80;

const allowedSearchCharacters = /^[A-Za-z0-9 .,!?_-]+$/;
const attackPatterns = [
  /<\s*script/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,
  /\bunion\s+select\b/i,
  /\bselect\b.+\bfrom\b/i,
  /\binsert\s+into\b/i,
  /\bdelete\s+from\b/i,
  /\bdrop\s+table\b/i,
  /\bupdate\b.+\bset\b/i,
  /\bor\s+1\s*=\s*1\b/i,
  /--|\/\*|\*\//
];

export function validateSearchTerm(searchTerm) {
  if (typeof searchTerm !== 'string') {
    return { valid: false, reason: 'invalid-type' };
  }

  const normalizedTerm = searchTerm.trim();

  if (normalizedTerm.length < minimumSearchLength) {
    return { valid: false, reason: 'too-short' };
  }

  if (normalizedTerm.length > maximumSearchLength) {
    return { valid: false, reason: 'too-long' };
  }

  if (
    !allowedSearchCharacters.test(normalizedTerm) ||
    attackPatterns.some((pattern) => pattern.test(normalizedTerm))
  ) {
    return { valid: false, reason: 'attack-pattern' };
  }

  return { valid: true, value: normalizedTerm };
}

export function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[character]
  );
}
