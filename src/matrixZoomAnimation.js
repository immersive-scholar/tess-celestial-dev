function matrixZoomAnimation (container, element) {
  const style = window.getComputedStyle(container)
  const columns = style.getPropertyValue('grid-template-columns')
    .split(' ').length
  const columnShift = columns / 2 - 0.5
  const rows = style.getPropertyValue('grid-template-rows')
    .split(' ').length
  const rowShift = rows / 2 - 0.5

  const elementColPos = Math.floor(+element.dataset.pos / columns)
  console.log(-columnShift, -rowShift, elementColPos)
}

export default matrixZoomAnimation
