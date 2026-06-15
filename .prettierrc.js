// gts's Prettier preset, inlined (we no longer depend on gts — it only provided
// this config and pulled in vulnerable transitive dev deps). Plus two overrides.
module.exports = {
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  semi: false,
  printWidth: 150,
}
