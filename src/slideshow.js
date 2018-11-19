/**
 * Used to cycle through projects or images of a project within the popup without having to
 * leave popup mode and triggering the zooming-out animation.
 * Clicking one of the arrows to the left/right of the popup moves to the previous/next
 * project in the matrix, respectively. Clicking a secondary image in a project causes it to
 * swap places with the primary image, meaning that the secondary image occupies the largest
 * space and allowing the user to get a closer look at the secondary image.
 *
 * Reference: https://www.w3schools.com/howto/howto_js_slideshow.asp
 */

/*
// TODO import slideshow.js and add these functions in conditionals to index.js
// Also need index.js to add onclick attributes to html buttons (start indexing at 0)

// Variables
var popupIdx = 0 // Index of the project in the matrix
var imgIdx = 0 // Index of the image in a project's array of images
getPopup(popupIdx)
swapPopupImg(imgIdx)

// Get current indices
function getCurrentIdx(n) {
  getPopup(popupIdx = n)
}

// Move to next popup
function changePopup(n) {
  getPopup(popupIdx += n)
}

// If arrow is clicked on, increment/decrement index and update info displayed in popup
function getPopup(n) {
  // Get array of all the matrix items
  var popups = document.getElementsByClassName("matrix-item")

  // Edge cases:
  // If index n is greater than the largest index in the array, change current index to 0
  // Else if n is negative, change current index to the last index
  if (n >= popups.length){
    popupIdx = 0
  } else if (n < 0) {
    popupIdx = popups.length - 1
  }

  // Swap info (images and text)
  // (Do we need conditionals and loops if secondary-img-slides arrays are diff lengths?)
}

// If secondary image is clicked on, use temp value to swap the secondary image and the
// primary image currently displayed. The secondary slide images and the primary image
// will reset back to their original images upon moving to a new project in the popup or
// leaving the popup.
function swapPopupImg() {

}

export {getPopup}
export {swapPopupImg}
*/
