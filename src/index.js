import './style.scss'
import columnResize from './columnResize.js'
import rawImgData from './data.csv'

// FOR TESTING: copy imgData multiple times to populate matrix
let imgData = rawImgData
for (let i = 0; i < 9; i++) {
  imgData = imgData.concat(...rawImgData)
}
imgData.push(rawImgData[0])
// Name of the folder containing the image assets, must be located in 'src' folder
const imgFolder = `test-img`

const matrix = document.querySelector('.matrix')

// This function takes in an image source path and a title to create an img element with alt-text. It returns the created img element.
const createImgElement = function (imgSrc, title) {
  const img = document.createElement('img')
  img.src = require(`./${imgFolder}/${imgSrc}`)
  img.alt = title
  img.dataset.id = title.split(' ').join('')
  return img
}

// An array containing the image elements of the matrix
const matrixImgs = imgData.map(d => createImgElement(d.imgName, d.title))

// Append matrix images to the matrix container
matrixImgs.forEach(function (img) {
  img.className = 'matrix-item'
  matrix.appendChild(img)
})

// This function takes in an array of objects with key names specified in 'data.csv' and returns an object with keys of 'title' and values of relative popup assets
const preparePopupAssets = function (assetsObject, value) {
  assetsObject[value.title.split(' ').join('')] = {
    title: value.title,
    text: value.storyText,
    storyMedia: [
      value.storyMedia1,
      value.storyMedia2,
      value.storyMedia3,
      value.storyMedia4
    ]
  }

  return assetsObject
}

const popupAssets = imgData.reduce(preparePopupAssets, {})

const showPopup = function (event) {
  const storyPopup = document.querySelector('.matrix-popup')
  if (!storyPopup.classList.contains('hidden')) { return }
  const storyId = this.dataset.id
  const story = popupAssets[storyId]

  // Set source of main img to img selected from matrix
  document.getElementById('primary-popup-img').src = this.src

  // Array of 'secondary' img elements from popup
  const secondaryImgs = document.querySelectorAll('.secondary-img')

  // Filter story media to display available 'secondary' images
  story.storyMedia
    .filter(d => d !== '')
    .forEach(function (mediaItem, i) {
      secondaryImgs[i].classList.remove('hidden')
      secondaryImgs[i].src = require(`./${imgFolder}/${storyId}/${mediaItem}`)
    })

  // Set the title and text of the story popup
  document.querySelector('.project-title').textContent = story.title
  document.querySelector('.project-story').textContent = story.text

  storyPopup.classList.remove('hidden')

  // Prevent click on matrix img throwing event attached to body
  event.stopPropagation()

  // This function removes the popup from the screen when a click occurs anywhere on the screem
  const removePopup = function () {
    console.log('popup!')
    storyPopup.classList.add('hidden')
    secondaryImgs.forEach(d => d.classList.add('hidden'))
    document.querySelector('body').removeEventListener('click', removePopup)
  }
  document.querySelector('body').addEventListener('click', removePopup)
}

// Attach an event listener to each matrix img to show popup on click
matrixImgs.forEach(d =>
  d.addEventListener('click', showPopup)
)

columnResize(matrix, matrixImgs)
