export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    });
  }

  const body = await readBody(event);
  
  // Validate request body
  if (!body.content || typeof body.content !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content is required and must be a string'
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

  // Generate UUID
  const uuid = crypto.randomUUID();
  
  // Create paste object
  const createdAt = new Date().toISOString();
  const expiresAt = body.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Default 7 days
  
  const paste = {
    content: body.content,
    createdAt,
    uuid,
    expiresAt
  };

  // Calculate TTL in seconds for KV expiration
  const ttl = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);

  // Store in KV with expiration
  await storage.put(`paste:${uuid}`, JSON.stringify(paste), {
    expirationTtl: ttl > 0 ? ttl : 60 // Minimum 60 seconds
  });

  // Return paste info (without content to keep response small)
  return {
    uuid,
    createdAt,
    expiresAt,
    url: `/api/paste/${uuid}`
  };
});
