// <![CDATA[


// Set up the scene, camera, and renderer as global variables
var scene, camera, renderer;

// Sets up the scene, renderer, camera, background color, controls
function initScene() {
  // Create scene and set size
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth * .8,
  HEIGHT = window.innerHeight;

  // Create the renderer and set size to same as scene
  var container = document.getElementById('canvas');
  //var w = container.offsetWidth;
  //var h = container.offsetHeight;
  renderer = new THREE.WebGLRenderer({antialias:true });
  renderer.setSize(WIDTH, HEIGHT);
  container.appendChild(renderer.domElement);

  // Create a camera, zoom it out from the model a bit, and add it to the scene
  camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT , 1, 3000);
  camera.position.set(0,0,1000);
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
  renderer.setClearColor(0xdedeff, 1);

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


// Declare icosaMeshes and icosaGeometries globally
var icosaMeshes = [];
var icosaGeometry;

// Initialize all the starting geometry
function initGeometry() {

  var cubeDimension = 5; // TODO: this variable should eventually be set by user input
  var numMeshes = Math.pow(cubeDimension, 3);
  var initIcosaRadius = 20;

  icosaGeometry = new THREE.IcosahedronGeometry( initIcosaRadius );
  for (var i = 0; i < icosaGeometry.faces.length; i++){
    var hue = Math.random();
    icosaGeometry.faces[i].color.setHSL(hue, 1.0, 0.7);
  }

  var cubeGroup = new THREE.Group();

  /* Create meshes out of the icosahedron geometry and push them to an array,
   * add that array element to a THREE.Group,
   * and translate them into their respective spots in cube formation
   * according to their index in the array of meshes.
   */
  for (var i = 0; i < numMeshes; i++){
    icosaMeshes.push( new THREE.Mesh( icosaGeometry, new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } )));

    var meshCoords = to3D(i, cubeDimension, cubeDimension);

    cubeGroup.add(icosaMeshes[i]);

    var cubeSpacing = 100;

    icosaMeshes[i].translateX(meshCoords[0] * cubeSpacing);
    icosaMeshes[i].translateY(meshCoords[1] * cubeSpacing);
    icosaMeshes[i].translateZ(meshCoords[2] * cubeSpacing);


  }

  /* TODO: To demonstrate a way of 3D visualization searching/locating:
   * Create a scene of geometries with a dat.gui search bar, where you can type in a number of geometry to search and when you search that number it'll grow to twice to scale.
   * then it shrinks to normal size once you've cleared the search or searched another geometry number.
   */

  // Convert a 1D array to a 3D array
  function to3D( index , xMax, yMax ){

    var coords;

    var z = parseInt(index / (xMax * yMax));
    index -= (z * xMax * yMax);
    var y = parseInt(index / xMax);
    var x = index % xMax;

    coords = [x,y,z];
    return coords;

  }

  // Convert 3D index to 1D index
  function to1D( x, y, z, xMax, yMax ){
    return (z * xMax * yMax) + (y * xMax) + x;
  }



  /* NUMBER LABELS
   * Adds a corresponding number (textGeometry) above each icosahedron
   */
  var loader = new THREE.FontLoader();

  try {

  // From https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
  function reqListener () {
    console.log(this.responseText);
  }
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "../node_modules/three/examples/fonts/gentilis_regular.typeface.json");
  oReq.send();

  console.log(oReq);

  loader.load( ' ../node_modules/three/examples/fonts/gentilis_regular.typeface.json ', function ( font ) {

    for (var i = 0; i < icosaMeshes.length; i++){

      var numberText = i + 1;

      var textGeom = new THREE.TextGeometry( numberText, {
        font: font,
        size: 10,
        height: 1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      });

      var textMesh = new THREE.Mesh(textGeom, new THREE.MeshBasicMaterial( { color: 0x000000 }));

      // Add all text meshes to the same group as the icosahedron geometries
      cubeGroup.add(textMesh);

      // Position each number above its respective icosahedron and then translate it up by 50
      textMesh.position.setFromMatrixPosition(icosaMeshes[i].matrix);
      textMesh.translateY(50);
    }
  });

  } catch (err) {
    console.log(err.message);
  }

  /* Add the group of icosahedrons in cubic formation to the scene and
   * shift it so it's centered on the origin
   */
  scene.add(cubeGroup);
  cubeGroup.translateX(-((cubeDimension - 1) * cubeSpacing) / 2);
  cubeGroup.translateY(-((cubeDimension - 1) * cubeSpacing) / 2);
  cubeGroup.translateZ(-((cubeDimension - 1) * cubeSpacing) / 2);

  var axesHelper = new THREE.AxesHelper( 50 );
  scene.add( axesHelper );

}

// Declare vertexPositions as a global variable to be used by getOriginalVertexPositions() and getNewVertices()
var vertexPositions = [];

// Save original icosahedron position
function getOriginalVertexPositions(geom) {

  // go through each vertex geometry and store their position in an Array
  for (var i = 0, l = geom.geometry.vertices.length; i < l; i++) {
    vertexPositions.push({x: geom.geometry.vertices[i].x, y: geom.geometry.vertices[i].y});
  }

  return vertexPositions;
}

// New vertices for tween
function getNewVertices(geom) {
  /* this function returns an array of vertice positions which are randomised
  from the original vertice position */
  var newVertices = [];
  var originalVertexPositions = getOriginalVertexPositions(geom);
  for (var i = 0, l = geom.geometry.vertices.length; i<l; i++) {
    newVertices[i] = {
      x: originalVertexPositions[i].x -(geom.geometry.parameters.radius / 4) + Math.random()*(geom.geometry.parameters.radius / 2),
      y: originalVertexPositions[i].y -(geom.geometry.parameters.radius / 4) + Math.random()*(geom.geometry.parameters.radius / 2)
    }
  }
  return newVertices;
}

// Tween geometry function
function tweenIcosahedron(geom) {
  var newVertexPositions = getNewVertices(geom);
  // tween each vertice to their new position
  for (var i = 0; i < geom.geometry.vertices.length; i++) {
    tweenVertex(i, newVertexPositions, geom);
  }
}

// Tween vertex function
function tweenVertex(i, newVertexPositions, geom) {
  // set the tween
  TweenLite.to(geom.geometry.vertices[i], 1, {x: newVertexPositions[i].x, y: newVertexPositions[i].y, ease: Back.easeInOut, onComplete: function() {
    // start the icosahedron tween again now the animation is complete
    if (i === 0) tweenIcosahedron(geom);
  }});
}

// Tween the icosahedron icosahedron geometries
function startTween(geom){
  // Store original vertex positions of each icosahedron geometry
  /*for (var i = 0; i < icosaMeshes.length; i++){
    getOriginalVertexPositions(icosaMeshes[i]);
    tweenIcosahedron(icosaMeshes[i]);
  }*/
  getOriginalVertexPositions(geom);
  tweenIcosahedron(geom);
}


// Check compatibility, run init functions, and animate
if (Detector.webgl) {
  // Initiate function or other initializations here
  initScene();
  initLighting();
  initGeometry();
  animate();

  for (i = 0; i < icosaMeshes.length; i++){
    startTween(icosaMeshes[i]);
  }
  //startTween(icosaMeshes);
  addGUI();

} else {
  var warning = Detector.getWebGLErrorMessage();

  document.getElementById('container').appendChild(warning);
}

// DAT GUI CONTROL PANEL
function addGUI() {

  var gui = new dat.GUI();

  var options = {
    scale: 1,
    searchTerm: 'test'
  }

  var previousSearch = 0; // Variable to store the index of the previously searched object

  gui.add(options, 'searchTerm').onFinishChange(function() {
    var searchIndex = parseInt(this.object.searchTerm) - 1;

    // Scale the searched object by 2
    TweenLite.to(icosaMeshes[searchIndex].scale, .5, {x: 2, y: 2, z: 2, ease: Back.easeInOut});

    // Scale the previously searched object back to 1
    TweenLite.to(icosaMeshes[previousSearch].scale, .5, {x: 1, y: 1, z: 1, ease: Back.easeInOut});
    previousSearch = searchIndex;
  });

  /*
  var controllers = [];

  // Create a slider for every icosahedron geometry, name it by number, and make it tween on change
  for (var j = 0; j < icosaMeshes.length; j++){
    controllers.push(gui.add(options, 'scale', 1, 2));
    controllers[j].name("Scale " + (j + 1));
    update(controllers[j]);
  }

  // Call onChange function for each controller in the controllers array
  function update(controller) {
    controller.onChange(function() {
      // Tween whichever mesh had its slider value changed
      TweenLite.to(icosaMeshes[controllers.indexOf(controller)].scale, .5, {x: options.scale, y: options.scale, z: options.scale, ease: Back.easeInOut});
    });
  }
  */

}

// Renders the scene and updates the render as needed
function animate() {

  // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimationFrame(animate);

  // Update vertices of icosahedron geometry
  //icosaGeometry.verticesNeedUpdate = true;
  for (var i = 0; i < icosaMeshes.length; i++){
    icosaMeshes[i].geometry.verticesNeedUpdate = true;
  }

  // Render the scene
  renderer.render(scene, camera);
  controls.update();
}



// ]]>
