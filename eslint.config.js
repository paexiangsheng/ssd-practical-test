import security from 'eslint-plugin-security';

export default [
  {
    ignores: [
      'node_modules/**',
      'reports/**',
      'certs/**'
    ]
  },
  security.configs.recommended
];
