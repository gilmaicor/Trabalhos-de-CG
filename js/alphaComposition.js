function alphaComposition( cnv, ctxb, ctxf, ctxa ) {

  var imageDataBack = ctxb.getImageData( 0, 0, cnv.width, cnv.height )
  var imageDataFore = ctxf.getImageData( 0, 0, cnv.width, cnv.height )
  var imageDataAlpha = ctxa.getImageData( 0, 0, cnv.width, cnv.height )

  for (i = 1; i < cnv.height - 1; i++) {
    for (j = 1; j < cnv.width - 1; j++) {

      var pixel = parseInt((j-1) + imageData.width * (i-1)) * 4

      for(k = 0; k<3; k++) {
        imageDataBack.data[pixel+k] = imageDataAlpha.data[pixel+k] * imageDataFore.data[pixel+k] + (1 - imageDataAlpha.data[pixel+k]) * imageDataBack.data[pixel+k]
      }
    }
  }

  ctxb.putImageData(imageDataBack, 0, 0, 0, 0, cnv.width, cnv.height)
  console.log("Alpha Composition")
  return cnv.toDataURL()

}