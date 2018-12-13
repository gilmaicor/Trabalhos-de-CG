function gammaCorrection( cnv, ctx ) {
  
  var gamma = 1.5
  var correction = 1 / gamma

  var imageData = ctx.getImageData( 0, 0, cnv.width, cnv.height )

  for (i = 0; i < imageData.height; i++) {
    for (j = 0; j < imageData.width; j++) {

      var pixel = parseInt(j + imageData.width * i) * 4

      for (k = 0; k < 3; k++) {

        imageData.data[pixel+k] = Math.pow((imageData.data[pixel+k]/255), correction) * 255;

      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height)
  console.log("gammaCorrection")
  return cnv.toDataURL()

}

function thresholding( cnv, ctx ) {

  var imageData = ctx.getImageData( 0, 0, cnv.width, cnv.height )
  

  for (i = 0; i < imageData.height; i++) {
    for (j = 0; j < imageData.width; j++) {

      var pixel = parseInt(j + imageData.width * i) * 4

      for (k = 0; k < 3; k++) {

        var color = imageData.data[pixel+k]

        if ( color < 127 ) {
          imageData.data[pixel+k] = 0
        } else {
          imageData.data[pixel+k] = 255
        }

      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height)
  console.log("Thresholding")
  return cnv.toDataURL()

}

function averagingFilter( cnv, ctx ) {

  var imageData = ctx.getImageData( 0, 0, cnv.width, cnv.height )

  for (i = 1; i < imageData.height - 1; i++) {
    for (j = 1; j < imageData.width - 1; j++) {

      var pixel = parseInt(j + imageData.width * i) * 4

      for (k = 0; k < 3; k++) {

        var totalSum = imageData.data[(parseInt((j-1) + imageData.width * (i-1)) * 4)+k] + imageData.data[(parseInt((j-1) + imageData.width * i) * 4)+k] + imageData.data[(parseInt((j-1) + imageData.width * (i+1)) * 4)+k] + imageData.data[(parseInt(j + imageData.width * (i-1)) * 4)+k] + imageData.data[(parseInt(j + imageData.width * i) * 4)+k] + imageData.data[(parseInt(j + imageData.width * (i+1)) * 4)+k] + imageData.data[(parseInt((j+1) + imageData.width * (i-1)) * 4)+k] + imageData.data[(parseInt((j+1) + imageData.width * i) * 4)+k] + imageData.data[(parseInt((j+1) + imageData.width * (i+1)) * 4)+k]

        var median = parseInt( totalSum / 9 )
        imageData.data[pixel+k] = median

      }

    }
  }
  

  ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height)
  console.log("averagingFilter")
  return cnv.toDataURL()

} 

function contrast( cnv, ctx ) {

  var imageData = ctx.getImageData( 0, 0, cnv.width, cnv.height )

  for (i = 0; i < imageData.height; i++) {
    for (j = 0; j < imageData.width; j++) {

      var pixel = parseInt(j + imageData.width * i) * 4

      for (k = 0; k < 3; k++) {

        var contrM = imageData.data[pixel+k] + imageData.data[pixel+k] * 10 / 100
        var contrm = imageData.data[pixel+k] - imageData.data[pixel+k] * 10 / 100

        if (contrM > 255) contrM = 255
        if (contrm < 0) contrm = 0
        if (imageData.data[pixel+k] < 127) imageData.data[pixel+k] = contrm
        else imageData.data[pixel+k] = contrM

      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height)
  console.log("Contrast")
  return cnv.toDataURL()
}

function medianFilter( cnv, ctx ) {

  imageData = ctx.getImageData( 0, 0, cnv.width, cnv.height )

  for (i = 1; i < imageData.height - 1; i++) {
    for (j = 1; j < imageData.width - 1; j++) {

      var pixel = parseInt((j-1) + imageData.width * (i-1)) * 4
      var array = []

      for(k = 0; k<3; k++) {
        array[0] = imageData.data[(parseInt((j-1) + imageData.width * (i-1)) * 4)+k]
        array[1] = imageData.data[(parseInt((j-1) + imageData.width * i) * 4)+k]
        array[2] = imageData.data[(parseInt((j-1) + imageData.width * (i+1)) * 4)+k]
        array[3] = imageData.data[(parseInt(j + imageData.width * (i-1)) * 4)+k]
        array[4] = imageData.data[(parseInt(j + imageData.width * i) * 4)+k]
        array[5] = imageData.data[(parseInt(j + imageData.width * (i+1)) * 4)+k]
        array[6] = imageData.data[(parseInt((j+1) + imageData.width * (i-1)) * 4)+k]
        array[7] = imageData.data[(parseInt((j+1) + imageData.width * i) * 4)+k]
        array[8] = imageData.data[(parseInt((j+1) + imageData.width * (i+1)) * 4)+k]

        array.sort()
        imageData.data[pixel+k] = array[4]
      }
    }
  }
  

  ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height)
  console.log("MedianFilter")
  return cnv.toDataURL()

}
