import styled, { keyframes } from 'styled-components'

const getShipMovementKeyFrames = (scale: number) => keyframes`
  from {
    transform: translate3d(0px, 0px, 0px) scale(1.0);
  }
  to {
    transform: translate3d(-100vw, -50vh, 0px) scale(${scale});
  }`

const MovingShipElem = styled.div<{ scale: number }>`
  position: fixed;
  top: 50vh;
  right: 0px;
  width: 300px;
  height: 300px;
  z-index: -4;
  background-size: cover;
  background-image: url('/space-ship-2-transparent.png');
  animation: ${props => getShipMovementKeyFrames(props.scale)} 120s linear forwards;
}`

export default function MovingShip({ scale }: { scale: number }) {
  return (
    <MovingShipElem scale={5 * scale} />
  )
}
