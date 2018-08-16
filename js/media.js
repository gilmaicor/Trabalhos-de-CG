let img = document.getElementById("image")
let cnv = document.getElementById("canvas")
let ctx = cnv.getContext('2d')

let imgW = Math.max(1, Math.floor(img.width));
let imgH = Math.max(1, Math.floor(img.height));

cnv.width = imgW
cnv.height = imgH


ctx.drawImage(img, 0, 0)

function media() {
  let gamma = 0.5
  let correction = 1 / gamma

  let pixels = ctx.getImageData(0, 0, imgW, imgH)

  for (i = 0; i < pixels.height; i++) {
    for (j = 0; j < pixels.width; j++) {
        let pixel = parseInt(j + pixels.width * i) * 4
        pixels.data[pixel] = Math.pow((pixels.data[pixel] / 255), correction) * 255;

        somaTotal = matrix[i-1][j-1] + matrix[i][j-1] + matrix[i+1][j-1] + matrix[i-1][j] + matrix[i][j] + matrix[i+1][j] + matrix[i-1][j+1] + matrix[i][j+1] + matrix[i+1][j+1]
        media = somaTotal / 9
        image.itemset((i, j), media)
    }
  }
  
  ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height)
  return cnv.toDataURL()
} 

img.onload = media()