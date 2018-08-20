function toGray( img, cnv ) {
  
  let pixels = ctx.getImageData( 0, 0, cnv.width, cnv.height )
  for (let y = 0; y < pixels.height; y ++) {
    for (let x = 0; x < pixels.width; x ++) {
      let i = (y * 4) * pixels.width + x * 4;
      let avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
      
      pixels.data[i] = avg;
      pixels.data[i + 1] = avg;
      pixels.data[i + 2] = avg;
    }
  }
  ctx.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
} 