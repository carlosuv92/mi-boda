import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFiD-vYSZviVYUb_rj3ij__anPXDTvYgQ.woff2'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8f4ef 0%, #ede6db 100%)',
          fontFamily: '"Playfair Display"',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '12px solid #c4a882',
            borderRadius: 0,
          }}
        />

        <div
          style={{
            fontSize: 80,
            fontWeight: 500,
            color: '#4a3f35',
            letterSpacing: '0.05em',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Felipe y Lilian
        </div>

        <div
          style={{
            width: 200,
            height: 2,
            background: '#c4a882',
            margin: '24px 0',
          }}
        />

        <div
          style={{
            fontSize: 28,
            color: '#7a6b5a',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 400,
          }}
        >
          Nuestra Boda
        </div>

        <div
          style={{
            fontSize: 22,
            color: '#9a8a7a',
            marginTop: 12,
            letterSpacing: '0.15em',
          }}
        >
          15 de abril de 2027
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Playfair Display',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
}
