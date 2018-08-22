$( document ).delegate( ".btn-run1", "click", function() {
	
	let image = "images/" + $( "#img option:selected" ).val() + ".jpg"
	let processing = $( "#processing option:selected" ).val()
	$( "#image" ).attr('src', image);
	
	let img = document.getElementById("image")
	let cnv = document.getElementById("canvas")
	let ctx = cnv.getContext('2d')
	
	cnv.width = Math.max(1, Math.floor(img.width))
	cnv.height = Math.max(1, Math.floor(img.height))
	
	ctx.drawImage(img, 0, 0)
	console.log(processing)
	
	switch ( processing ) {
		case '1':
		  gammaCorrection( cnv, ctx );
		  break;
		case '2':
		  thresholding( cnv, ctx );
		  break;
		case '3':
		  averagingFilter( cnv, ctx );
		  break;
		case '4':
		  contrast( cnv, ctx );
		  break;
		case '5':
		  medianFilter( cnv, ctx );
	}
	
});

$( document ).delegate( ".btn-run2", "click", function() {
	
	let background = document.getElementById("background")
	
	let cnv = document.getElementById("canvas")
	let ctxb = cnv.getContext('2d')
	
	
	cnv.width = Math.max(1, Math.floor(background.width))
	cnv.height = Math.max(1, Math.floor(background.height))
	
	ctxb.drawImage(background, 0, 0)
	
	let imageDataBack = ctxb.getImageData( 0, 0, cnv.width, cnv.height )
  

  for (i = 0; i < imageDataBack.height; i++) {
    for (j = 0; j < imageDataBack.width; j++) {

      var pixel = parseInt(j + imageDataBack.width * i) * 4

      for (k = 0; k < 3; k++) {

        var color = imageDataBack.data[pixel+k]

        if ( color < 127 ) {
          imageDataBack.data[pixel+k] = 0
        } else {
          imageDataBack.data[pixel+k] = 255
        }

      }
    }
  }
  
  ctxb.putImageData(imageDataBack, 0, 0, 0, 0, imageDataBack.width, imageDataBack.height)
  console.log("Thresholding")
  return cnv.toDataURL()
	
});