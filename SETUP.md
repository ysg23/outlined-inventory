# Lightspeed Inventory Dashboard Setup Guide

## 🚀 Quick Setup

### 1. Vercel Environment Variables

Set these environment variables in your Vercel dashboard:

```bash
LIGHTSPEED_CLIENT_ID=your_client_id_from_lightspeed
LIGHTSPEED_CLIENT_SECRET=your_client_secret_from_lightspeed
LIGHTSPEED_REDIRECT_URI=https://outlined-inventory.vercel.app/oauth/callback
LIGHTSPEED_CLUSTER=us1
```

### 2. Lightspeed App Configuration

In your Lightspeed Developer Dashboard, ensure:

**Redirect URI**: `https://inventory.outlined.ca/oauth/callback`
**Scopes**: `employee:register employee:inventory` (or `employee:all`)

### 3. Deploy to Vercel

```bash
# If you haven't already
npm run build
vercel --prod
```

## 🧪 Testing the Setup

### Test Endpoints

1. **Configuration Test**: 
   ```
   GET https://inventory.outlined.ca/api/lightspeed/test-oauth
   ```

2. **OAuth Flow Test**:
   ```
   Visit: https://inventory.outlined.ca/login
   ```

### Expected Flow

1. User visits `/login`
2. Clicks "Connect with Lightspeed"
3. Redirects to Lightspeed OAuth page
4. User authorizes the app
5. Lightspeed redirects to `/oauth/callback` with authorization code
6. App exchanges code for access token
7. User is redirected to `/inventory` dashboard

## 🐛 Troubleshooting

### Common Issues

1. **"OAuth configuration not loaded"**
   - Check that all environment variables are set
   - Verify the `/api/lightspeed/auth` endpoint is working

2. **"Invalid OAuth state"**
   - Clear browser localStorage and try again
   - Ensure redirect URI matches exactly

3. **"Failed to exchange authorization code"**
   - Verify client ID and secret are correct
   - Check that the authorization code hasn't expired (60 seconds)

4. **"Missing authentication credentials"**
   - Complete the OAuth flow first
   - Check that tokens are saved in localStorage

### Debug Commands

```bash
# Test OAuth config
curl https://inventory.outlined.ca/api/lightspeed/test-oauth

# Test basic endpoint
curl https://inventory.outlined.ca/api/test
```

## 🔧 Local Development

For local development, use:

```bash
# Set in .env.local
LIGHTSPEED_CLIENT_ID=your_client_id
LIGHTSPEED_CLIENT_SECRET=your_client_secret  
LIGHTSPEED_REDIRECT_URI=https://outlined-inventory.vercel.app/oauth/callback
LIGHTSPEED_CLUSTER=us1

# Start dev server
npm run dev
```

## 📚 API Endpoints

- `GET /api/lightspeed/auth` - OAuth configuration
- `POST /api/lightspeed/auth` - Token exchange
- `GET /api/lightspeed/inventory` - Fetch inventory items
- `GET /api/lightspeed/stats` - Fetch inventory statistics
- `GET /api/lightspeed/test-oauth` - Configuration test
- `GET /api/test` - Basic connectivity test

## 🔐 Security Notes

- Access tokens are stored in browser localStorage
- Tokens expire after 1 hour (configurable)
- Refresh tokens can be used to get new access tokens
- All API calls include proper CORS headers
- OAuth state parameter prevents CSRF attacks