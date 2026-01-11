# Xyra-Paste

A simple, API-only pastebin built with Nitro and deployable to Cloudflare Pages.

## Features

- Create pastes with automatic expiration
- Retrieve pastes by UUID
- Built-in CORS support
- Automatic cleanup via KV expiration

## API Endpoints

### Create a Paste

**POST** `/api/paste`

```json
{
  "content": "Your paste content here",
  "expiresAt": "2026-01-18T00:00:00.000Z" // Optional, defaults to 7 days
}
```

Response:
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-01-11T10:00:00.000Z",
  "expiresAt": "2026-01-18T10:00:00.000Z",
  "url": "/api/paste/550e8400-e29b-41d4-a716-446655440000"
}
```

### Retrieve a Paste

**GET** `/api/paste/{uuid}`

Response:
```json
{
  "content": "Your paste content here",
  "createdAt": "2026-01-11T10:00:00.000Z",
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-01-18T10:00:00.000Z"
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment to Cloudflare Pages

### Prerequisites

1. A Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler`)

### Setup

1. **Create a KV namespace:**
   ```bash
   wrangler kv:namespace create "PASTES"
   ```
   
   Note the ID returned by this command.

2. **Deploy to Cloudflare Pages:**
   
   Using Wrangler CLI:
   ```bash
   npm run build
   wrangler pages deploy .output/public
   ```
   
   Or connect your GitHub repository to Cloudflare Pages Dashboard:
   - Go to Cloudflare Pages Dashboard
   - Click "Create a project"
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set build output directory: `.output/public`

3. **Configure KV binding:**
   
   In your Cloudflare Pages project settings:
   - Go to Settings → Functions → KV namespace bindings
   - Add a binding:
     - Variable name: `PASTES`
     - KV namespace: Select the namespace you created

4. **Set compatibility date:**
   
   Create a `wrangler.toml` file if deploying via CLI, or set in Pages settings.

## Environment Variables

The app uses Cloudflare KV for storage. The binding name must be `PASTES`.

## License

MIT
