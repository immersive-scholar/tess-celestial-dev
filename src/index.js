import './style.scss'
import imgData from './data.csv'

// Name of the folder containing the image assets, must be located in 'src' folder
const imgFolder = `test-img`

const matrix = document.querySelector('.matrix')

// This function takes in an image source path and a title to create an img element with alt-text and append it to the matrix container. It returns the created img element.
const attachImages = function (imgSrc, title) {
  const img = document.createElement('img')
  img.src = require(`./${imgFolder}/${imgSrc}`)
  img.alt = title
  img.className = 'matrix-item'
  matrix.appendChild(img)
  return img
}

const matrixImgs = imgData.map(d =>
  attachImages(d.imgName, d.title)
)

const showPopup = function () {
  // const storyPopup = document.querySelector('.matrix-popup')
  console.log('popup!')
}

matrixImgs.forEach(d =>
  d.addEventListener('click', showPopup)
)
