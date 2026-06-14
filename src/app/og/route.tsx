import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract params
    const title = searchParams.get('title') || 'Free Game on GamesDealsHub';
    const platform = searchParams.get('platform') || 'PC';
    const expiry = searchParams.get('expiry') || 'Limited Time';
    const image = searchParams.get('image');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            backgroundColor: '#0f172a', // Tailwind slate-900
            backgroundImage: image ? `url(${image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.4) 100%)',
            }}
          />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '60px',
              position: 'relative',
              zIndex: 10,
              width: '100%',
            }}
          >
            {/* Badges Row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  background: '#3b82f6', // blue-500
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '9999px',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                {platform}
              </div>
              <div
                style={{
                  background: '#ef4444', // red-500
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '9999px',
                  fontSize: 24,
                  fontWeight: 'bold',
                  display: 'flex',
                }}
              >
                FREE until {expiry}
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: 'white',
                margin: 0,
                lineHeight: 1.1,
                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              {title}
            </h1>
            
            {/* Branding */}
            <div style={{ color: '#94a3b8', fontSize: 32, marginTop: '20px', fontWeight: 600 }}>
              GamesDealsHub
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
