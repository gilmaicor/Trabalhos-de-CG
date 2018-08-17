  function gammaCorrection( cnv, ctx ) {
    
    let gamma = 0.5
    let correction = 1 / gamma
  
    let pixels = ctx.getImageData( 0, 0, cnv.width, cnv.height )
  
    for (i = 0; i < pixels.height; i++) {
      for (j = 0; j < pixels.width; j++) {
          let pixel = parseInt(j + pixels.width * i) * 4
          pixels.data[pixel] = Math.pow((pixels.data[pixel] / 255), correction) * 255;
      }
    }
    
    ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height)
    console.log("gammaCorrection")
    return cnv.toDataURL()

  }

  function thresholding( cnv, ctx ) {

    let pixels = ctx.getImageData( 0, 0, cnv.width, cnv.height )

    for (i = 0; i < pixels.height; i++) {
      for (j = 0; j < pixels.width; j++) {
        let pixel = parseInt(j + pixels.width * i) * 4
  
        if ( pixels.data[pixel] < 127 ) pixels.data[pixel] = 0
        else pixels.data[pixel] = 255
      }
    }
    
    ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height)
    console.log("Thresholding")
    return cnv.toDataURL()

  }

  function averagingFilter( cnv, ctx ) {
  
    let pixels = ctx.getImageData( 0, 0, cnv.width, cnv.height )
  
    for (i = 1; i < pixels.height - 1; i++) {
      for (j = 1; j < pixels.width - 1; j++) {

          let pixel = parseInt((j-1) + pixels.width * (i-1)) * 4
          
          let somaTotal = pixels.data[parseInt((j-1) + pixels.width * (i-1)) * 4] + pixels.data[parseInt((j-1) + pixels.width * i) * 4] + pixels.data[parseInt((j-1) + pixels.width * (i+1)) * 4] + pixels.data[parseInt(j + pixels.width * (i-1)) * 4] + pixels.data[parseInt(j + pixels.width * i) * 4] + pixels.data[parseInt(j + pixels.width * (i+1)) * 4] + pixels.data[parseInt((j+1) + pixels.width * (i-1)) * 4] + pixels.data[parseInt((j+1) + pixels.width * i) * 4] + pixels.data[parseInt((j+1) + pixels.width * (i+1)) * 4]

          let median = parseInt( somaTotal / 9 )
          pixels.data[pixel] = median

      }
    }
    

    ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height)
    console.log("averagingFilter")
    return cnv.toDataURL()

  } 

  function contrast( cnv, ctx ) {

    let pixels = ctx.getImageData( 0, 0, cnv.width, cnv.height )
  
    for (i = 0; i < pixels.height; i++) {
      for (j = 0; j < pixels.width; j++) {

          let pixel = parseInt(j + pixels.width * i) * 4

          let contrM = pixels.data[pixel] + pixels.data[pixel] * 10 / 100
          let contrm = pixels.data[pixel] - pixels.data[pixel] * 10 / 100

          if (contrM > 255) contrM = 255
          if (contrm < 0) contrm = 0
          if (pixels.data[pixel] < 127) pixels.data[pixel] = contrm
          else pixels.data[pixel] = contrM

      }
    }
    
    ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height)
    console.log("Contrast")
    return cnv.toDataURL()
  }

  function medianFilter( cnv, ctx ) {
  
    let pixels = ctx.getImageData( 0, 0, cnv.width, cnv.height )
  
    for (i = 1; i < pixels.height - 1; i++) {
      for (j = 1; j < pixels.width - 1; j++) {

          let pixel = parseInt((j-1) + pixels.width * (i-1)) * 4
          let array = []
          
          array[0] = pixels.data[parseInt((j-1) + pixels.width * (i-1)) * 4]
          array[1] = pixels.data[parseInt((j-1) + pixels.width * i) * 4]
          array[2] = pixels.data[parseInt((j-1) + pixels.width * (i+1)) * 4]
          array[3] = pixels.data[parseInt(j + pixels.width * (i-1)) * 4]
          array[4] = pixels.data[parseInt(j + pixels.width * i) * 4]
          array[5] = pixels.data[parseInt(j + pixels.width * (i+1)) * 4]
          array[6] = pixels.data[parseInt((j+1) + pixels.width * (i-1)) * 4]
          array[7] = pixels.data[parseInt((j+1) + pixels.width * i) * 4]
          array[8] = pixels.data[parseInt((j+1) + pixels.width * (i+1)) * 4]

          array.sort()
          pixels.data[pixel] = array[4]

      }
    }
    

    ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height)
    console.log("MedianFilter")
    return cnv.toDataURL()

  }