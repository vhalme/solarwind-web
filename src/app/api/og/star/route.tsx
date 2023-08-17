import { ImageResponse } from '@vercel/og'

export async function GET(request: Request) {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'lightblue',
          backgroundSize: '150px 150px',
          height: '100%',
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap',
        }}>
        <div
          style={{
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            color: 'black',
            marginTop: 30,
            padding: '0 120px',
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
            display: 'flex'
          }}>

          <div style={{
            width: '100px', 
            height: '100px',
            display: 'flex',
            borderRadius: '50%',
            border: '4px solid red'
          }}>

          </div>
        </div>
      </div>
    ),
    {
      width: 1024,
      height: 1024,
    },
  )
}