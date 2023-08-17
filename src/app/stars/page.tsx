import StarsView from './StarsView'

export const metadata = {
  title: 'Solarwind Metaverse - Stars',
  description: 'Physically accurate galactic metaverse',
  openGraph: {
    title: 'Solarwind Metaverse - Stars',
    description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
    url: 'https://solarwindmetaverse.com',
    type: 'article',
    images: ['https://solarwindmetaverse.com/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solarwind Metaverse - Stars',
    description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
    images: ['https://solarwindmetaverse.com/twitter-image.png']
  }
}

export default function Stars() {
  return (
    <StarsView />
  )
}