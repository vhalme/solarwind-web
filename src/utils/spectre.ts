export interface StarColor {
  r: number
  g: number
  b: number
}

export function getSpectralColor(spectralType: string): StarColor {

  // Define the RGB values for the colors of each spectral class
  const spectralColors: { [key: string]: number[] } = {
    O: [95, 155, 255],
    B: [120, 180, 255],
    A: [170, 205, 255],
    F: [255, 230, 160],
    G: [255, 244, 117],
    K: [255, 168, 60],
    M: [255, 85, 0],
    L: [150, 75, 0],
    T: [120, 50, 0],
    DA: [255, 255, 255],
    DB: [230, 230, 255],
    DC: [230, 230, 230],
    DO: [230, 230, 255],
    DQ: [230, 230, 255],
    DZ: [230, 230, 230],
  }

  // Extract the spectral class and subtype from the spectral type
  const spectralClass = spectralType.startsWith('D') ? spectralType.substring(0, 2) : spectralType.substring(0, 1)
  const spectralSubtype = spectralClass.length === 1 ? parseInt(spectralType.substring(1, 2)) : parseInt(spectralType.substring(2, 3))

  // Determine the RGB value based on the spectral class and subtype
  let color: number[]
  if (spectralClass.startsWith('D') || spectralClass === 'L' || spectralClass === 'T') {
    color = spectralColors[spectralClass]
  } else {
    const blue = spectralColors[spectralClass][0] - 5 * spectralSubtype
    const green = spectralColors[spectralClass][1] - 5 * spectralSubtype
    const red = spectralColors[spectralClass][2] + 5 * spectralSubtype
    color = [Math.max(0, Math.min(blue, 255)), Math.max(0, Math.min(green, 255)), Math.max(0, Math.min(red, 255))]
  }

  return { r: color[0], g: color[1], b: color[2] }

}
