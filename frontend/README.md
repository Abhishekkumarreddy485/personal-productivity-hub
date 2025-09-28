# Frontend - Personal Productivity Hub

- Next.js + Tailwind (minimal)
- Set environment variable NEXT_PUBLIC_API_BASE to your backend URL (e.g., https://your-backend.onrender.com)
- `cd frontend`
- `npm install`
- `npm run dev`

## Notes
- Image field for books is optional. If empty, a generated placeholder cover is shown.
- For adding books/quotes you need to be authenticated. Use the backend /api/auth/register and /api/auth/login to obtain a JWT token and store it in localStorage under `pph_token` (value should be "Bearer <token>" or the frontend will attach it as Bearer).
