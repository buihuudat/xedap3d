// Sim.js - A Simple Simulator for WebGL (based on Three.js)

Sim = {};

// Sim.Publisher - base class for event publishers
Sim.Publisher = function() {
    this.messageTypes = {};
}

Sim.Publisher.prototype.subscribe = function(message, subscriber, callback) {
    var subscribers = this.messageTypes[message];
    if (subscribers)
    {
        if (this.findSubscriber(subscribers, subscriber) != -1)
        {
            return;
        }
    }
    else
    {
        subscribers = [];
        this.messageTypes[message] = subscribers;
    }

    subscribers.push({ subscriber : subscriber, callback : callback });
}

Sim.Publisher.prototype.unsubscribe =  function(message, subscriber, callback) {
    if (subscriber)
    {
        var subscribers = this.messageTypes[message];

        if (subscribers)
        {
            var i = this.findSubscriber(subscribers, subscriber, callback);
            if (i != -1)
            {
                this.messageTypes[message].splice(i, 1);
            }
        }
    }
    else
    {
        delete this.messageTypes[message];
    }
}

Sim.Publisher.prototype.publish = function(message) {
    var subscribers = this.messageTypes[message];

    if (subscribers)
    {
        for (var i = 0; i < subscribers.length; i++)
        {
            var args = [];
            for (var j = 0; j < arguments.length - 1; j++)
            {
                args.push(arguments[j + 1]);
            }
            subscribers[i].callback.apply(subscribers[i].subscriber, args);
        }
    }
}

Sim.Publisher.prototype.findSubscriber = function (subscribers, subscriber) {
    for (var i = 0; i < subscribers.length; i++)
    {
        if (subscribers[i] == subscriber)
        {
            return i;
        }
    }
    
    return -1;
}

// Sim.App - application class (singleton)
Sim.App = function()
{
	Sim.Publisher.call(this);
	
	this.renderer = null;
	this.scene = null;
	this.camera = null;
	this.objects = [];
}

Sim.App.prototype = new Sim.Publisher;

Sim.App.prototype.init = function(param)
{
	param = param || {};	
	var container = param.container;
	var canvas = param.canvas;
	
    // Create the Three.js renderer, add it to our div
    var renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    var scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x505050 ) );
    scene.data = this;

    // Put in a camera at a good default location
    camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 10000 );
    camera.position.set( 0, 0, 3.3333 );

    scene.add(camera);
    
    // Create a root object to contain all other scene objects
    var root = new THREE.Object3D();
    scene.add(root);
    
    // Create a projector to handle picking
    var projector = new THREE.Projector();
    
    // Save away a few things
    this.container = container;
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.projector = projector;
    this.root = root;

    function animate () {
        requestAnimationFrame( animate );
        scene.data.update();
				root.rotation.y += 0.005;
        renderer.render( scene, camera );
    }
    animate();
}

//Core run loop
Sim.App.prototype.run = function()
{
	this.update();
	this.renderer.render( this.scene, this.camera );
	var that = this;
	requestAnimationFrame(function() { that.run(); });	
}

// Update method - called once per tick
Sim.App.prototype.update = function()
{
	var i, len;
	len = this.objects.length;
	for (i = 0; i < len; i++)
	{
		this.objects[i].update();
	}
}





