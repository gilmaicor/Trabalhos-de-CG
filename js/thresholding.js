let img = document.getElementById("image")
let cnv = document.getElementById("canvas")
let ctx = cnv.getContext('2d')

let imgW = Math.max(1, Math.floor(img.width));
let imgH = Math.max(1, Math.floor(img.height));

cnv.width = imgW
cnv.height = imgH


ctx.drawImage(img, 0, 0)

function thresholding() {
  let pixels = ctx.getImageData(0, 0, imgW, imgH)
  for (i = 0; i < pixels.height; i++) {
    for (j = 0; j < pixels.width; j++) {
      let pixel = parseInt(j + pixels.width * i) * 4

      if (pixels.data[pixel] < 127) {
        pixels.data[pixel] = 0
      } else {
        pixels.data[pixel] = 255
      }
    }
  }
  
  ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height)
  return cnv.toDataURL()
} 

img.onload = thresholding()