export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid');

  if (!uuid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'UUID is required'
    });
  }

  // Get Cloudflare KV namespace
  const storage = event.context.cloudflare?.env?.PASTES;
  
  if (!storage) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Storage not configured'
    });
  }

  // Retrieve paste from KV
  const pasteData = await storage.get(`paste:${uuid}`);

  if (!pasteData) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Paste not found or expired'
    });
  }

  const paste = JSON.parse(pasteData);

  // Check if paste has expired (extra validation)
  if (new Date(paste.expiresAt) < new Date()) {
    await storage.delete(`paste:${uuid}`);
    throw createError({
      statusCode: 410,
      statusMessage: 'Paste has expired'
    });
  }

  return paste;
});
