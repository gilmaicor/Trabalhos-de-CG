let mouseX = 0, mouseY = 0,

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,

SEPARATION = 300,
AMOUNTX = 10,
AMOUNTY = 10,

camera, scene, renderer;

init();
animate();

function init() {

	let container, separation = 100, amountX = 50, amountY = 50,
	particles, particle;

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 100;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );

	renderer = new THREE.CanvasRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// color

	function color() {
		var value = Math.floor(Math.random() * 16777215);
		value = value.toString(16);
		// while ( value.length <= 6) {
		// 	if (value.length == 6) {
				return '#' + value;
		// 	} else {
		// 		value = value + '0';
		// 	}
		// }
	}

	// particles

	function ball(){
		let PI2 = Math.PI * 2;
		let material = new THREE.SpriteCanvasMaterial( {

		color: color(),
		program: function ( context ) {

					context.beginPath();
					context.arc( 0, 0, 0.5, 0, PI2, true );
					context.fill();

				}
		} );

		return material
	}

	let points = [];

	for ( let i = 0; i < 500; i ++ ) {

		let particle = new THREE.Sprite( ball() );
		particle.position.x = Math.random() * 2 - 1;
		particle.position.y = Math.random() * 2 - 1;
		particle.position.z = Math.random() * 2 - 1;
		particle.position.normalize();
		particle.position.multiplyScalar( Math.random() * 10 + 450 );
		particle.scale.x = particle.scale.y = 10;
		scene.add( particle );

		points.push( particle.position );

	}

	// geometry

	let geometry = new THREE.BufferGeometry().setFromPoints( points );

	scene.add( geometry );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function onDocumentMouseMove(event) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart( event ) {

	if ( event.touches.length > 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;

	}

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}