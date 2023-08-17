export const getLogScaleFactor = (value: number): number => {
  const logL = Math.log10(value)
  const logLSun = 0.0 // log10(1) = 0
  const diff = logL - logLSun
  const scale = 1 + diff / 10
  return scale
}