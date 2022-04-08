MaterialApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
MaterialApp.prototype = new Sim.App();

// Our custom initializer
MaterialApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);

	// Some scene lighting
	var ambientLight = new THREE.AmbientLight( 0x444444 );
	this.scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(0x00A7D8, 1);
	directionalLight.position.set(-.3333, 1, .777).normalize();
	this.scene.add( directionalLight );
	this.directionalLight = directionalLight;

	this.camera.position.set(0, 10.0, 25.0);
	this.camera.lookAt(this.root.position);
	
	this.createGrid();
	this.createObjects();
	// this.animate();
	// this.createAnimations();
}

MaterialApp.prototype.createGrid = function()
{
	var line_material = new THREE.LineBasicMaterial( { color: 0xC38E63, opacity: 0.8 } ),
		geometry = new THREE.Geometry(),
		floor = -2, step = 1, size = 66;
	
	for ( var i = 0; i <= size / step * 2; i ++ )
	{
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );
	
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );
	}
	
	var grid = new THREE.Line( geometry, line_material, THREE.LinePieces );

	this.root.add(grid);
}

MaterialApp.prototype.createObjects = function()
{
	const loader = new Sim.ColladaLoader ( );
	loader.load( 'models/mountain-bike.dae', (deaModel)=>{	
		this.root.add(deaModel.scene);
		// const timer = Date.now() * 0.0001
	});
}