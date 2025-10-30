# BookIt Frontend Deployment Guide

## Local Development

1. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
```

2. Install dependencies and start the development server:
```bash
npm install
npm run dev
```

## Production Deployment

### 1. Netlify Deployment

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your backend URL (e.g., `https://your-backend.onrender.com`)

### 2. Vercel Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: Your backend URL
4. Deploy! Vercel will automatically detect Vite settings

### 3. Manual Build

To build the project locally:
```bash
npm install
npm run build
```
The built files will be in the `dist` directory.

## Troubleshooting

1. **API Errors**
   - Check Network tab in browser DevTools
   - Ensure VITE_API_URL is set correctly
   - Verify backend URL is accessible

2. **CORS Issues**
   - Backend must allow requests from your frontend domain
   - Check browser console for CORS errors

3. **HTTPS/SSL**
   - If frontend uses HTTPS, backend must also use HTTPS
   - Browser blocks mixed content (HTTPS frontend → HTTP backend)

4. **Build Problems**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall: `npm install`