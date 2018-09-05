import './style.scss'
import { sample, shuffle } from 'lodash'
import columnResize from './columnResize.js'
import matrixZoomAnimation from './matrixZoomAnimation.js'
import rawImgData from './data.csv'

// Name of the folder containing the image assets, must be located in 'src' folder
const imgFolder = `images`
const imgData = rawImgData
// Variables for timed transitions and zoom animation speed, timed transitions will be set if 'timedTransitions' is 'true'
const zoomSpeed = 8000 // 8 sec for zoom in/out animation
let timedTransitions = true
const timeBetweenPopup = 30000 + zoomSpeed // 30 sec in full matrix view
const timePopupShown = 60000 + zoomSpeed // 60 sec in popup view
let timedPopup

// FOR TESTING: copy imgData multiple times to populate matrix
// const imgPadding = 21 - imgData.length
// for (let i = 0; i < imgPadding; i++) {
//   imgData.push(sample(rawImgData))
// }

const matrix = document.querySelector('.matrix')

// This function takes in an image source path and a title to create an img element with alt-text. It returns the created img element.
const createImgElement = function (imgSrc, title) {
  const img = document.createElement('img')
  img.src = require(`./${imgFolder}-small/${imgSrc}`)
  img.alt = title
  img.dataset.id = title.split(' ').join('')
  // Set seperate sources for full matrix view (smallSrc) and the current image used in the zoom and popup window (bigSrc). These are switched on show/remove popup
  img.dataset.bigSrc = require(`./${imgFolder}/${imgSrc}`)
  img.dataset.smallSrc = require(`./${imgFolder}-small/${imgSrc}`)
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
    !d.classList.contains('removed') && !('viewed' in d.dataset))
  )

  // Set viewed data option of element to true to prevent repeating of stories when in timed mode
  currentStory.dataset.viewed = true
  // If all stories have been viewed remove viewed data option to start fresh
  if (matrixImgs.filter(d => !('viewed' in d.dataset)).length === 0) {
    matrixImgs.forEach(d => delete d.dataset.viewed)
  }

  // Switch src to higher resolution image for zoom
  currentStory.src = currentStory.dataset.bigSrc

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

  // Zoom in on selected element (currentStory) in the matrix and display popup (storyPopup) after animation completes
  matrixZoomAnimation(matrix, currentStory, storyPopup, 'zoom-in', zoomSpeed)

  // This function removes the popup from the screen when a click occurs anywhere on the screen except on top of the open popup
  const removePopup = function (event) {
    // TODO get rid of this when done testing
    // console.log(event, event.path.includes(document.querySelector('#close-button')))

    // Return if click occured on top of the popup and not on the close button
    if (event && event.path.includes(storyPopup) &&
      !event.path.includes(document.querySelector('#close-button'))) { return }

    // Zoom out of selected element (currentStory) in the matrix and remove popup (storyPopup) before animation completes
    matrixZoomAnimation(matrix, currentStory, storyPopup, 'zoom-out', zoomSpeed)
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

  document.querySelector('#close-button').addEventListener('click', removePopup)
}

// Attach an event listener to each matrix img to show popup on click
matrixImgs.forEach(d =>
  d.addEventListener('click', showPopup)
)

if (timedTransitions) { timedPopup = window.setTimeout(showPopup, timeBetweenPopup) }

// This function removes overflow images from the matrix at media breakpoints to ensure every row has an equal number of columns given a matrix with 'x' grid columns and 'y' images
columnResize(matrix, matrixImgs)
