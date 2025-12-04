# Genuka Express Boilerplate

A production-ready Express.js boilerplate for integrating with the Genuka e-commerce platform. Built with TypeScript, Prisma ORM, and Bun runtime.

## Features

- **OAuth 2.0 Integration** - Complete OAuth flow with Genuka
- **JWT Session Management** - Secure session handling with jose library
- **Authentication Middleware** - Protected routes with JWT verification
- **Webhook Handling** - Receive and process Genuka events
- **Database Integration** - MySQL/MariaDB with Prisma ORM
- **TypeScript** - Fully typed codebase
- **Service Layer Architecture** - Clean separation of concerns
- **HMAC Validation** - Secure callback verification with timing-safe comparison
- **Bun Runtime** - Fast JavaScript runtime and package manager

## Prerequisites

- **Bun** 1.0+ (recommended) or Node.js 18+
- **MySQL** or **MariaDB** database
- **Genuka Account** with OAuth credentials

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/usegenuka/genuka-express-boilerplate.git
cd genuka-express-boilerplate
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/genuka_express"

# Genuka OAuth
GENUKA_URL="https://api.genuka.com"
GENUKA_CLIENT_ID="your_client_id"
GENUKA_CLIENT_SECRET="your_client_secret"
GENUKA_REDIRECT_URI="http://localhost:3000/api/auth/callback"
```

### 3. Setup Database

```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push
```

### 4. Run Development Server

```bash
bun run dev
```

The server will be available at `http://localhost:3000`

## Project Structure

```
genuka-express-boilerplate/
├── src/
│   ├── config/
│   │   ├── env.ts              # Environment variables
│   │   └── constants.ts        # App constants
│   ├── controllers/
│   │   ├── auth.controller.ts       # Auth endpoints (me, logout, check)
│   │   ├── callback.controller.ts   # OAuth callback handler
│   │   └── webhook.controller.ts    # Webhook event handler
│   ├── middleware/
│   │   └── auth.middleware.ts  # JWT authentication middleware
│   ├── routes/
│   │   └── auth.routes.ts      # Auth routes
│   ├── services/
│   │   ├── auth/
│   │   │   ├── oauth.service.ts     # OAuth business logic
│   │   │   └── session.service.ts   # JWT session management
│   │   ├── database/
│   │   │   └── company.service.ts   # Company DB operations
│   │   └── genuka/
│   │       └── api.service.ts       # Genuka API client
│   ├── types/
│   │   └── express.d.ts        # Express type extensions
│   ├── utils/
│   │   ├── hmac.ts             # HMAC signature utilities
│   │   └── prisma.ts           # Prisma client singleton
│   └── index.ts                # App entry point
├── prisma/
│   └── schema.prisma           # Database schema
├── .env.example                # Environment template
└── package.json
```

## Available Scripts

```bash
# Development
bun run dev              # Start with hot reload

# Production
bun run start            # Start server

# Database
bun run db:generate      # Generate Prisma client
bun run db:push          # Push schema to DB
bun run db:migrate       # Create migration
bun run db:migrate:deploy # Deploy migrations (production)
bun run db:studio        # Open Prisma Studio
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | API info |
| GET | `/health` | No | Health check |
| GET | `/api/auth/callback` | No | OAuth callback handler |
| POST | `/api/auth/webhook` | No | Webhook event handler |
| GET | `/api/auth/check` | No | Check if authenticated |
| POST | `/api/auth/refresh` | No | Refresh expired session |
| GET | `/api/auth/me` | Yes | Get current company info |
| POST | `/api/auth/logout` | Yes | Logout and destroy session |

## OAuth Flow

1. User clicks "Install App" in Genuka
2. Genuka redirects to `/api/auth/callback` with authorization code
3. App validates HMAC signature and timestamp
4. App exchanges code for tokens (`access_token` + `refresh_token`)
5. Company info is fetched and stored in database
6. **JWT session is created and stored in HTTP-only cookie**
7. User is redirected to dashboard

## Authentication

### Double Cookie Security Pattern

This boilerplate uses a secure **double cookie pattern** for session management:

| Cookie | Duration | Purpose |
|--------|----------|---------|
| `session` | 7 hours | Access protected routes |
| `refresh_session` | 30 days | Securely refresh expired sessions |

Both cookies are **HTTP-only** (not accessible via JavaScript) and **signed JWT** (cannot be forged).

### Session Refresh (No Reinstall Required)

When the session expires, the client can securely refresh it:

```
POST /api/auth/refresh
// No body required! The refresh_session cookie is sent automatically
```

**Security Flow:**
1. Client calls `POST /api/auth/refresh` with no body
2. Server reads `refresh_session` cookie (HTTP-only, inaccessible to JS)
3. Server verifies the JWT signature (cannot be forged)
4. Server extracts `companyId` from the verified JWT
5. Server retrieves Genuka `refresh_token` from database
6. Server calls Genuka API with `refresh_token` + `client_secret`
7. Server updates tokens in database
8. Server creates new `session` + `refresh_session` cookies

**Why this is secure:**
- No data sent in request body (nothing to forge)
- `companyId` comes from a signed JWT cookie (tamper-proof)
- Cookies are HTTP-only (not accessible via JavaScript/XSS)
- Genuka `refresh_token` is never exposed to the client
- Genuka API validates with `client_secret` (server-side only)

### Protecting Routes

Use the `authMiddleware` to protect your routes:

```typescript
import { authMiddleware } from "@/middleware/auth.middleware.js";

// Protected route - requires authentication
router.get("/protected", authMiddleware, (req, res) => {
  // req.companyId is available here
  res.json({ companyId: req.companyId });
});
```

### Session Service Methods

```typescript
import { sessionService } from "@/services/auth/session.service.js";

// Create a session (automatically sets cookie)
await sessionService.createSession(companyId, res);

// Get authenticated company from request
const company = await sessionService.getAuthenticatedCompany(req);

// Check if request is authenticated
const isAuth = await sessionService.isAuthenticated(req);

// Get company or throw error
const company = await sessionService.requireAuth(req);

// Destroy session (logout)
sessionService.destroySession(res);
```

### Callback Parameters

| Parameter | Description |
|-----------|-------------|
| `code` | Authorization code |
| `company_id` | Genuka company ID |
| `timestamp` | Request timestamp |
| `hmac` | HMAC signature |
| `redirect_to` | Redirect URL after success |

## Client Usage (Frontend Integration)

This API uses HTTP-only cookies for session management. Here's how to integrate with a frontend client:

### JavaScript/TypeScript Client Example

```typescript
const API_URL = 'http://localhost:4000';

// Store companyId locally (safe - it's a public identifier)
let companyId: string | null = localStorage.getItem('companyId');

// Check if authenticated
async function checkAuth(): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/auth/check`, {
    credentials: 'include', // Important: send cookies
  });
  const data = await res.json();
  return data.authenticated;
}

// Get current company info
async function getMe() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include',
  });

  if (res.status === 401) {
    // Session expired, try to refresh
    return await refreshSession();
  }

  return res.json();
}

// Refresh expired session
async function refreshSession() {
  if (!companyId) {
    throw new Error('No companyId stored. User needs to reinstall app.');
  }

  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyId }),
  });

  if (!res.ok) {
    // Refresh token invalid, need to reinstall
    localStorage.removeItem('companyId');
    throw new Error('Session expired. Please reinstall the app.');
  }

  return res.json();
}

// Logout
async function logout() {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  localStorage.removeItem('companyId');
}

// After OAuth callback, store the companyId
function onAuthCallback(companyId: string) {
  localStorage.setItem('companyId', companyId);
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useAuth() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const isAuth = await checkAuth();
        if (isAuth) {
          const data = await getMe();
          setCompany(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return { company, loading, error, logout, refreshSession };
}
```

### Important Notes

1. **Always use `credentials: 'include'`** - Required to send/receive HTTP-only cookies
2. **CORS Configuration** - Ensure your API allows credentials from your frontend origin
3. **Store only `companyId`** - Never store tokens on the client; they're in HTTP-only cookies
4. **Handle 401 errors** - Always try to refresh before asking user to reinstall

## Webhook Events

The boilerplate handles these webhook events:

- `company.updated` - Company information changed
- `company.deleted` - Company deleted
- `order.created` - New order created
- `order.updated` - Order status changed
- `product.created` - New product added
- `product.updated` - Product information changed
- `subscription.created` - New subscription
- `subscription.updated` - Subscription modified
- `subscription.cancelled` - Subscription cancelled
- `payment.succeeded` - Payment processed
- `payment.failed` - Payment failed

### Customizing Webhook Handlers

Edit `src/controllers/webhook.controller.ts` to add your business logic:

```typescript
private async handleOrderCreated(event: WebhookEvent): Promise<void> {
  console.log('Order created:', event.data);
  // Your custom logic here
}
```

## Database Schema

### Company Model

| Field | Type | Description |
|-------|------|-------------|
| id | String | Genuka company ID (primary key) |
| handle | String | Unique company handle |
| name | String | Company name |
| description | Text | Company description |
| logoUrl | String | Logo URL |
| accessToken | Text | OAuth access token (JWT) |
| refreshToken | Text | OAuth refresh token (for session renewal) |
| tokenExpiresAt | DateTime | Access token expiration date |
| authorizationCode | String | OAuth authorization code |
| phone | String | Contact phone |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

## Security

### HMAC Validation

OAuth callbacks validate HMAC signatures to ensure request authenticity:

1. Build params with ALL query parameters
2. Sort parameters alphabetically by key
3. Build URL-encoded query string
4. Calculate HMAC-SHA256
5. Compare using timing-safe comparison

### Timestamp Validation

Requests older than 5 minutes are rejected to prevent replay attacks.

## Deployment

### Environment Variables

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="mysql://..."
GENUKA_URL="https://api.genuka.com"
GENUKA_CLIENT_ID="..."
GENUKA_CLIENT_SECRET="..."
GENUKA_REDIRECT_URI="https://yourdomain.com/api/auth/callback"
```

### Production Checklist

1. Set `NODE_ENV=production`
2. Use secure database credentials
3. Configure proper redirect URIs in Genuka dashboard
4. Run database migrations: `bun run db:migrate:deploy`

## Troubleshooting

### "Invalid HMAC signature"

- Verify `GENUKA_CLIENT_SECRET` matches your Genuka dashboard
- Check server time is synchronized (NTP)
- Ensure callback happens within 5 minutes

### "Token exchange failed"

- Verify `GENUKA_CLIENT_ID` and `GENUKA_CLIENT_SECRET`
- Ensure `GENUKA_REDIRECT_URI` matches exactly with Genuka dashboard
- Authorization codes can only be used once

### Database Connection Issues

```bash
# Test database connection
mysql -u root -p

# Verify DATABASE_URL format
mysql://user:password@localhost:3306/database_name
```

## Resources

- [Genuka Documentation](https://docs.genuka.com)
- [Express.js Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Bun Documentation](https://bun.sh/docs)

## License

MIT

---

**Built with love in Cameroon** 🇨🇲

Made with [Express.js](https://expressjs.com) and [Genuka](https://genuka.com)
