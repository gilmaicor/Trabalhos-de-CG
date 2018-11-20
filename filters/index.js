function setup_filter() {

	var image = document.getElementById("img").value;

	var img = new Image();
			img.title = image;
			img.src = "images/" + image + ".jpg";
	
	var cnv = document.getElementById("canvas1");
	var ctx = cnv.getContext('2d');
			
	cnv.width = Math.max(1, Math.floor(img.width));
	cnv.height = Math.max(1, Math.floor(img.height));
			
	ctx.drawImage(img, 0, 0);
	cnv.toDataURL();

	var processing = document.getElementById("processing").value;

	var cnv = document.getElementById("canvas2");
	var ctx = cnv.getContext('2d');
	
	cnv.width = Math.max(1, Math.floor(img.width));
	cnv.height = Math.max(1, Math.floor(img.height));
	
	ctx.drawImage(img, 0, 0);
	console.log(processing);
	
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
}