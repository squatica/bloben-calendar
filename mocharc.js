module.exports = {
  exit: true,
  reporter: 'spec',
  timeout: 20000,
  require: ['./tests/hooks.ts'],
  spec: ['./tests/**/*.test.ts'],
};
