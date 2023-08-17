import axios from 'axios'
import https from 'https'
import StarView from './StarView'
import { Metadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: URLSearchParams
}

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {

  // read route params
  const id = params.id
  const { APP_URL } = process.env

  console.log('APP_URL', APP_URL)
  
  const agent = new https.Agent({
    rejectUnauthorized: false,
  })

  const starUrl = `${APP_URL}/api/stars/${id}`
  const star = await axios.get(starUrl, {
    httpsAgent: agent
  })

  let title = 'Solarwind Metaverse - Star'
  if (star && star.data) {
    title = `Solarwind Metaverse - ${star.data.name}`
  }
  
  return {
    title,
    description: 'Physically accurate galactic metaverse',
    openGraph: {
      title,
      description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
      url: 'https://solarwindmetaverse.com',
      type: 'article',
      images: ['https://solarwindmetaverse.com/opengraph-image.png']
    },
    twitter: {
      title,
      card: 'summary_large_image',
      description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
      images: ['https://solarwindmetaverse.com/twitter-image.png']
    }
  }
}

/*
export const metadata = {
  title: 'Solarwind Metaverse - Star',
  description: 'Physically accurate galactic metaverse',
  openGraph: {
    title: 'Solarwind Metaverse - Star',
    description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
    url: 'https://solarwindmetaverse.com',
    type: 'article',
    images: ['https://solarwindmetaverse.com/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solarwind Metaverse - Star',
    description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
    images: ['https://solarwindmetaverse.com/twitter-image.png']
  }
}
*/

export default function Star({ params }: { params: { id: string } }) {
  return (
    <StarView params={params} />
  )
}