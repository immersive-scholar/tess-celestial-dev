import './style.scss'
import { sample, shuffle } from 'lodash'
import columnResize from './columnResize.js'
import matrixZoomAnimation from './matrixZoomAnimation.js'
import rawImgData from './data.csv'

// Name of the folder containing the image assets, must be located in 'src' folder
const imgFolder = `test-img`
let imgData = rawImgData
// Variables for timed transitions, timed transitions will be set if 'timedTransitions' is 'true'
let timedTransitions = true
const timeBetweenPopup = 5000
const timePopupShown = 30000
let timedPopup

// FOR TESTING: copy imgData multiple times to populate matrix
const imgPadding = 21 - imgData.length
for (let i = 0; i < imgPadding; i++) {
  imgData.push(sample(rawImgData))
}

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
const matrixImgs = shuffle(imgData).map(d => createImgElement(d.imgName, d.title))

// Append matrix images to the matrix container
matrixImgs.forEach(function (img, i) {
  img.className = 'matrix-item'
  img.dataset.pos = i
  matrix.appendChild(img)
})

// TODO assetsObject Key is obsolete with new data format!!!!!!!
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

// This function displays a story popup window and assigns the content of that window based on data bound to the activated matrix img
const showPopup = function (event) {
  const storyPopup = document.querySelector('.matrix-popup')

  // If a story popup is already visible, prevent a new popup from being displayed
  if (storyPopup.classList.contains('visible')) { return }

  // Set 'currentStory' to clicked matrix img element or random selection of images that have not been removed from the display if timed event
  const currentStory = event ? this : sample(matrixImgs.filter(d =>
    !d.classList.contains('removed'))
  )
  const storyId = currentStory.dataset.id
  const story = popupAssets[storyId]

  // Set source of main img to img selected from matrix
  document.getElementById('primary-popup-img').src = currentStory.src

  // Set array of 'secondary' img elements from popup and make sure to remove any previously used images
  const secondaryImgs = document.querySelectorAll('.secondary-img')
  secondaryImgs.forEach(d => d.classList.add('removed'))

  // Filter story media to display available secondary images
  story.storyMedia
    .filter(d => d !== '')
    .forEach(function (mediaItem, i) {
      secondaryImgs[i].classList.remove('removed')
      secondaryImgs[i].src = require(`./${imgFolder}/${mediaItem}`)
    })

  // Set the title and text of the story popup
  document.querySelector('.project-title').textContent = story.title
  document.querySelector('.project-story').textContent = story.text

  // Insert the story title into the "Learn more about (project)" URL
  document.querySelector('.project-name-insert').textContent = story.title

  // Zoom in on selected element (currentStory) in the matrix and display popup (storyPopup) after animation completes
  matrixZoomAnimation(matrix, currentStory, storyPopup, 'zoom-in')

  // This function removes the popup from the screen when a click occurs anywhere on the screen except on top of the open popup
  const removePopup = function (event) {
    // Return if click occured on top of the popup
    if (event && event.path.includes(storyPopup)) { return }

    // Zoom out of selected element (currentStory) in the matrix and remove popup (storyPopup) before animation completes
    matrixZoomAnimation(matrix, currentStory, storyPopup, 'zoom-out')
    storyPopup.classList.remove('visible')

    // Timeout and interactive events
    document.querySelector('body').removeEventListener('click', removePopup)
    window.clearTimeout(timedPopup)
    if (!event) { timedPopup = window.setTimeout(showPopup, timeBetweenPopup) }
  }

  // If popup was made visible via a click event, prevent the 'removePopup' event attached to body from being thrown
  if (event) {
    event.stopPropagation()
    window.clearTimeout(timedPopup)
  } else {
    window.clearTimeout(timedPopup)
    timedPopup = window.setTimeout(removePopup, timePopupShown)
  }
  document.querySelector('body').addEventListener('click', removePopup)
}

// Attach an event listener to each matrix img to show popup on click
matrixImgs.forEach(d =>
  d.addEventListener('click', showPopup)
)

if (timedTransitions) { timedPopup = window.setTimeout(showPopup, timeBetweenPopup) }

// This function removes overflow images from the matrix at media breakpoints to ensure every row has an equal number of columns given a matrix with 'x' grid columns and 'y' images
columnResize(matrix, matrixImgs)
