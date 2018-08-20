$( document ).delegate( ".btn-run", "click", function() {

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

  img = toGray(img, cnv, ctx)

  switch ( processing ) {
    case '1':
        img.onload = gammaCorrection(toGray);
        console.log('ok')
        break;
    case '2':
        img.onload = thresholding( cnv, ctx );
        break;
    case '3':
        img.onload = averagingFilter( cnv, ctx );
        break;
    case '4':
        img.onload = contrast( cnv, ctx );
        break;
    case '5':
        img.onload = medianFilter( cnv, ctx );
  }
});