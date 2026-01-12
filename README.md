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

### Method 1: Direct Upload via Wrangler (Recommended)

This is the most reliable method for Nitro apps:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Cloudflare Pages (creates project if it doesn't exist)
npx wrangler pages deploy dist --project-name=xyra-paste

# Or if project already exists, just:
npx wrangler pages deploy dist
```

After deployment:
1. Go to Cloudflare Dashboard → Workers & Pages → your project
2. Click "Settings" → "Functions"
3. Under "KV namespace bindings", click "Add binding":
   - Variable name: `PASTES`
   - KV namespace: Create or select your PASTES namespace
4. Save and the site will automatically redeploy

### Method 2: Git Integration (Alternative)

If you prefer Git-based deployments:

1. **Push your code to GitHub**

2. **Create KV namespace:**
   - Go to Cloudflare Dashboard → Workers & Pages → KV
   - Click "Create a namespace" and name it `PASTES`

3. **Connect to Cloudflare Pages:**
   - Go to Cloudflare Pages Dashboard
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   
4. **Configure build settings:**
   - Framework preset: `None`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler pages deploy dist`
   - Root directory (Path): `/`

5. **Add KV binding:**
   - After first deployment, go to Settings → Functions
   - Add KV namespace binding: Variable name `PASTES`
   - Save and redeploy

## Environment Variables

The app uses Cloudflare KV for storage. The binding name must be `PASTES`.

## License

MIT
