const app = require('./app.json');

/**
 * app.json is the source of truth. This wrapper exists for one thing: a static
 * web export served from a subpath (GitHub Pages serves this repo at
 * /rail, not at the domain root) needs its asset URLs prefixed to match.
 *
 *   PAGES_BASE_URL=/rail npx expo export --platform web
 *
 * Left unset — every normal run, including `expo start` and native builds —
 * nothing changes.
 */
module.exports = () => {
  const base = process.env.PAGES_BASE_URL;
  return {
    ...app.expo,
    ...(base ? { experiments: { ...(app.expo.experiments ?? {}), baseUrl: base } } : null),
  };
};
