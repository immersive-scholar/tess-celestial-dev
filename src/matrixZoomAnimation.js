function matrixZoomAnimation (container, element) {
  const style = window.getComputedStyle(container)
  const columns = style.getPropertyValue('grid-template-columns')
    .split(' ').length
  const columnShift = columns / 2 - 0.5
  const rows = style.getPropertyValue('grid-template-rows')
    .split(' ').length
  const rowShift = rows / 2 - 0.5

  const elementRowPos = Math.floor(+element.dataset.pos / columns)
  const elementColPos = +element.dataset.pos - elementRowPos * columns

  const xTranslate = (columnShift - elementColPos) / columns
  const yTranslate = (rowShift - elementRowPos) / rows

  const containerAnimation = container.animate([
    {transform: 'scale(1) translate(0)'},
    {transform: `scale(12) translateX(calc(${xTranslate} * 100%)) translateY(calc(${yTranslate} * 100%))`}
  ], 3000)
  containerAnimation.addEventListener('finish', function () {
    container.style.transform = `scale(12) translateX(calc(${xTranslate} * 100%)) translateY(calc(${yTranslate} * 100%))`
  })
  console.log(-columnShift, -rowShift, xTranslate * 100, yTranslate * 100)
}

export default matrixZoomAnimation
