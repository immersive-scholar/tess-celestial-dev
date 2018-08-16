function matrixZoomAnimation (container, element, popup, direction) {
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

  const animationDirection = direction === 'zoom-in' ? [
    {
      transform: 'scale(1) translate(0)',
      // opacity: '1',
      filter: 'blur(0)'
    },
    {
      transform: `scale(12) translateX(calc(${xTranslate} * 100%)) translateY(calc(${yTranslate} * 100%))`,
      // opacity: '0.5',
      filter: 'blur(2px)'
    }
  ] : direction === 'zoom-out' ? [
    {
      transform: `scale(12) translateX(calc(${xTranslate} * 100%)) translateY(calc(${yTranslate} * 100%))`,
      // opacity: '0.5',
      filter: 'blur(2px)'
    },
    {
      transform: 'scale(1) translate(0)',
      // opacity: '1',
      filter: 'blur(0)'
    }
  ] : null

  const containerAnimation = container.animate(animationDirection, {
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    duration: 8000
  })

  containerAnimation.addEventListener('finish', function () {
    container.style.transform = animationDirection[1].transform
    // container.style.opacity = animationDirection[1].opacity
    container.style.filter = animationDirection[1].filter
    if (direction === 'zoom-in') {
      popup.classList.add('visible')
    } else if (direction === 'zoom-out') {
      // Switch src to lower resolution image for full matrix view
      element.src = element.dataset.smallSrc
    }
  })
}

export default matrixZoomAnimation
