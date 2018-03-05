// <![CDATA[


// Set up the scene, camera, and renderer as global variables
var scene, camera, renderer;
// Set up vertexPositions array as global
var vertexPositions = [];

// Sets up the scene, renderer, camera, background color, controls
function initScene() {
  // Create scene and set size
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

  // Create the renderer and set size to same as scene
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  // Create a camera, zoom it out from the model a bit, and add it to the scene
  camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 1, 500);
  camera.position.set(0,0,100);
  camera.lookAt(new THREE.Vector3(0,0,0));
  scene.add(camera);

  // Create an event listener that resizes the renderer with the browser window
  window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH/HEIGHT;
    camera.updateProjectionMatrix();
  });

  // Set the background color of the scene
  renderer.setClearColor(0xFFFFFF, 1);

  // Add OrbitControls to allow panning around with mouse
  controls = new THREE.OrbitControls(camera, renderer.domElement);
}


// Initialize all the lighting
function initLighting() {
  // Create a light, set its position, and add it to the scene
  var light = new THREE.PointLight(0xffffff);
  light.position.set(-100,200,100);
  scene.add(light);
}


// Declare boxGeometry, boxEdges, outlinedBox, and vertexPositions[] globally
var icosaGeometry, icosaMesh, icosa2, icosa3;

// Initialize all the starting geometry
function initGeometry() {

  icosaGeometry = new THREE.IcosahedronGeometry( 20 );

  // Give random colors to every face on the geometry
  for ( var i = 0; i < icosaGeometry.faces.length; i++){
    var hue = Math.random();
    icosaGeometry.faces[i].color.setHSL(hue, 1.0, 0.7);
  }

  icosaMesh = new THREE.Mesh( icosaGeometry, new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } ));

  icosa2 = icosaMesh.clone();
  icosa3 = icosaMesh.clone();

  icosaMesh.translateX(-50);
  icosa3.translateX(50);
  scene.add(icosaMesh);
  scene.add(icosa2);
  scene.add(icosa3);
}

// Save original icosahedron position
function getOriginalVertexPositions() {
  // go through each vertex geometry and store their position in an Array
  for (var i = 0, l = icosaGeometry.vertices.length; i < l; i++) {
    vertexPositions.push({x: icosaGeometry.vertices[i].x, y: icosaGeometry.vertices[i].y});
  }
}

// New vertices for tween
function getNewVertices() {
  /* this function returns an array of vertice positions which are randomised
  from the original vertice position */
  var newVertices = [];
  for (var i = 0, l = icosaGeometry.vertices.length; i<l; i++) {
    newVertices[i] = {
      x: vertexPositions[i].x -5 + Math.random()*10,
      y: vertexPositions[i].y -5 + Math.random()*10
    }
  }
  return newVertices;
}

// Tween geometry function
function tweenIcosahedron() {
  var newVertexPositions = getNewVertices();
  // tween each vertice to their new position
  for (var i = 0; i < icosaGeometry.vertices.length; i++) {
    tweenVertex(i, newVertexPositions);
  }
}

// Tween vertex function
function tweenVertex(i, newVertexPositions) {
  // set the tween
  TweenLite.to(icosaGeometry.vertices[i], 1, {x: newVertexPositions[i].x, y: newVertexPositions[i].y, ease: Back.easeInOut, onComplete: function() {
    // start the icosahedron tween again now the animation is complete
    if (i === 0) tweenIcosahedron();
  }});
}

// Check compatibility, run init functions, and animate
if (Detector.webgl) {
  // Initiate function or other initializations here
  initScene();
  initLighting();
  initGeometry();
  getOriginalVertexPositions();
  animate();
  tweenIcosahedron();
} else {
  var warning = Detector.getWebGLErrorMessage();

  document.getElementById('container').appendChild(warning);
}

// DAT GUI CONTROL PANEL

var gui = new dat.GUI();

var options = {
  scale: 1
}

//for (var j = 0; j<5; j++){
  gui.add(options, 'scale', 1, 2).onChange(function() {
    // scale the middle icosahedron by changing the value of each of its scale vector components
    icosa2.scale.x = options.scale;
    icosa2.scale.y = options.scale;
    icosa2.scale.z = options.scale;
  });

//}



// Renders the scene and updates the render as needed
function animate() {

  // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimationFrame(animate);
  icosaGeometry.verticesNeedUpdate = true;

  /*icosaMesh.rotateX(.01);
  icosaMesh.rotateY(.02);
  icosaMesh.rotateZ(.01);*/

  /*icosa2.rotateX(.02);
  icosa2.rotateY(.01);
  icosa2.rotateZ(.02);*/

  /*icosa3.rotateX(-.03);
  icosa3.rotateY(.01);
  icosa3.rotateZ(.01);*/

  // Render the scene
  renderer.render(scene, camera);
  controls.update();
}



// ]]>
