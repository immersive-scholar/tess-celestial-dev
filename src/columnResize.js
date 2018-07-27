function columnResizeOnAspectChange (container, elements) {
  const aspect1 = window.matchMedia('(max-aspect-ratio: 4815/2100)')
  const aspect2 = window.matchMedia('(max-aspect-ratio: 558/210)')
  aspect1.addListener(addRemoveColumns)
  aspect2.addListener(addRemoveColumns)

  function addRemoveColumns (event) {
    const style = window.getComputedStyle(container)
    const numColumns = style.getPropertyValue('grid-template-columns')
      .split(' ').length
    const numElementsOverflow = elements.length % numColumns

    elements.forEach(function (element, i) {
      if (i > elements.length - numElementsOverflow - 1) {
        element.classList.add('hidden')
      } else {
        element.classList.remove('hidden')
      }
    })
  }

  addRemoveColumns(aspect1)
}

export default columnResizeOnAspectChange
