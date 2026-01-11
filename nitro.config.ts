export default defineNitroConfig({
  preset: 'cloudflare-pages',
  compatibilityDate: '2025-01-11',
  routeRules: {
    '/**': {
      cors: true,
      headers: {
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'access-control-allow-origin': '*',
      }
    }
  }
});
