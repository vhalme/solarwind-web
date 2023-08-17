'use client'

import React, { ReactElement, useState } from 'react'
import { 
  useGetStarsQuery,
  useLazyGetStarsQuery,
  useCreateStarMutation,
  useUpdateStarMutation,
  useDeleteStarMutation,
  useMintStarNftMutation
} from '@/state/api/starsApiSlice'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { StarData } from 'solarwind-common/dist/model/star'
import cx from 'classnames'
import styles from './Admin.module.css'

type StarInputs = {
    [key: string]: string
}

function shortenUuid(uuid: string): string {
  return uuid.slice(0, 4) + '..' + uuid.slice(-4)
}

function AdminPage() {

  const [starToEditId, setStarToEditId] = useState<string | null>(null)
  const [starToEditTokenId, setStarToEditTokenId] = useState<number | null>(null)

  const [starInputs, setStarInputs] = useState<Partial<StarData>>({})

  const fetchedStars = useGetStarsQuery()
  const [getStars] = useLazyGetStarsQuery()

  const [createStar] = useCreateStarMutation()
  const [updateStar] = useUpdateStarMutation()
  const [deleteStar] = useDeleteStarMutation()
  const [mintStarNft] = useMintStarNftMutation()

  function starInput(key: string, label: string): ReactElement {

    return (
      <div className={styles.starInput}>
        <TextField
          label={label}
          value={(starInputs as StarInputs)[key] || ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setStarInputs({
              ...starInputs,
              [key]: event.target.value
            })
          }}
        />
      </div>
    )
  
  }

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.editorControls}>
          <Button variant="contained" onClick={async () => {
            setStarToEditId(null)
            setStarInputs({})
          }}>NEW STAR</Button>
        </div>
        <div className={styles.starEditor}>
          <div className={styles.starSearch}>
            <div className={styles.searchControls}>
            </div>
            <div className={styles.starList}>
              <div>
                {
                  fetchedStars.isSuccess &&
                  fetchedStars.data.map((star, i) => {
                    return (
                      <div key={`stars-${i}`} className={styles.starEntry}>
                        <div className={styles.starLabel} onClick={() => {
                          setStarToEditId(star.id)
                          setStarToEditTokenId(star.tokenId)
                          setStarInputs({
                            edr3Id: star.edr3Id,
                            name: star.name,
                            ra: star.ra,
                            dec: star.dec,
                            pmRa: star.pmRa,
                            pmDec: star.pmDec,
                            parallax: star.parallax,
                            mass: star.mass,
                            radius: star.radius,
                            temperature: star.temperature,
                            magnitude: star.magnitude,
                            luminosity: star.luminosity,
                            evolutionaryStage: star.evolutionaryStage,
                            spectralType: star.spectralType,
                            age: star.age
                          })
                        }}>
                          <div className={cx(styles.starId, starToEditId === star.id ? styles.starSelected : null)}>
                            {shortenUuid(star.id)}
                          </div>
                          <div className={styles.starName}>
                            {star.name}
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className={styles.editStar}>
            {
              !starToEditId &&
                <div className={styles.editStarHeader}>
                  <div className={styles.editStarHeaderTitle}>
                    New star
                  </div>
                </div>
            }
            <div className={styles.starInputsContainer}>
              <div className={styles.starInputsRow}>
                { starInput('edr3Id', 'EDR3 ID') }
                { starInput('name', 'NAME') }
              </div>
              <div className={styles.starInputsRow}>
                { starInput('ra', 'RA') }
                { starInput('dec', 'DEC') }
                { starInput('parallax', 'PARALLAX') }
              </div>
              <div className={styles.starInputsRow}>
                { starInput('pmRa', 'PM RA') }
                { starInput('pmDec', 'PM DEC') }
              </div>
              <div className={styles.starInputsRow}>
                { starInput('mass', 'MASS') }
                { starInput('radius', 'RADIUS') }
                { starInput('temperature', 'TEMPERATURE') }
              </div>
              <div className={styles.starInputsRow}>
                { starInput('magnitude', 'MAGNITUDE') }
                { starInput('luminosity', 'LUMINOSITY') }
                { starInput('spectralType', 'SPECTRAL TYPE') }
              </div>

              <div className={styles.starInputsRow}>
                { starInput('evolutionaryStage', 'EVOLUTIONARY STAGE') }
                { starInput('age', 'AGE') }
              </div>
            </div>
            {
              starToEditId ?
                <div className={styles.starSubmitContainer}>
                  <Button variant="contained" onClick={async () => {
                    await deleteStar(starToEditId)
                    setStarToEditId(null)
                    setStarInputs({})
                    await getStars()
                  }}>DELETE</Button>
                  <Button variant="contained" onClick={async () => {
                    const starData = starInputs as StarData
                    console.log(starInputs, starData)
                    await updateStar({ id: starToEditId, star: starData })
                    await getStars()
                  }}>SAVE</Button>
                  <Button variant="contained" 
                    disabled={!!starToEditTokenId}
                    onClick={async () => {
                      console.log('Mint nft for', starToEditId)
                      const result = mintStarNft({ id: starToEditId })
                      const tokenId = await result.unwrap()
                      console.log('Minted nft', tokenId)
                      setStarToEditTokenId(tokenId)
                      await getStars()
                    }}>MINT</Button>
                </div> :
                <div className={styles.starSubmitContainer}>
                  <Button variant="contained" onClick={async () => {
                    const result = createStar(starInputs as StarData)
                    const star = await result.unwrap()
                    setStarToEditId(star.id)
                    await getStars()
                  }}>CREATE</Button>
                </div>
            }
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default AdminPage