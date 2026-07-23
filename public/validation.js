const minimumSearchLength = 2;
const maximumSearchLength = 80;
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

function validateSearchTerm(searchTerm) {
  const normalizedTerm = searchTerm.trim();

  if (normalizedTerm.length < minimumSearchLength) {
    return { valid: false, message: `Enter at least ${minimumSearchLength} characters.` };
  }

  if (normalizedTerm.length > maximumSearchLength) {
    return { valid: false, message: `Enter no more than ${maximumSearchLength} characters.` };
  }

  if (
    !allowedSearchCharacters.test(normalizedTerm) ||
    attackPatterns.some((pattern) => pattern.test(normalizedTerm))
  ) {
    return { valid: false, message: 'The search term contains unsafe characters or patterns.' };
  }

  return { valid: true, value: normalizedTerm };
}

const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchTerm');
const message = document.querySelector('#validationMessage');

if (new URLSearchParams(window.location.search).has('invalid')) {
  message.textContent = 'The previous search term was rejected. Enter a new search term.';
}

form.addEventListener('submit', (event) => {
  const validation = validateSearchTerm(input.value);

  if (!validation.valid) {
    event.preventDefault();
    input.value = '';
    message.textContent = validation.message;
    input.focus();
    return;
  }

  input.value = validation.value;
});
