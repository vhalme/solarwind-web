import styles from './page.module.css'

import ShipsList from '../ShipsList'
import ShipView from './ShipView'

export const metadata = {
  title: 'Solarwind Metaverse - Ship',
  description: 'Physically accurate galactic metaverse',
  openGraph: {
    title: 'Solarwind Metaverse - Ship',
    description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
    url: 'https://solarwindmetaverse.com',
    type: 'article',
    images: ['https://solarwindmetaverse.com/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solarwind Metaverse - Ship',
    description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
    images: ['https://solarwindmetaverse.com/twitter-image.png']
  }
}

export default function Ship({ params }: { params: { id: string } }) {

  return (
    <div className={styles.content}>
      <div className={styles.ship}>
        <ShipView params={params} />
      </div>
      <div>
        <ShipsList />
      </div>
    </div>
  )

}