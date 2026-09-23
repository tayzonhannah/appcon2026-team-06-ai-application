import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kith',
    short_name: 'Kith',
    description: 'AI-Powered Offline Growth & Emotion Coaching — Build connections that last.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#F1E4D1',
    theme_color: '#F1E4D1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
