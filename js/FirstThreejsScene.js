// <![CDATA[


// Set up the scene, camera, and renderer as global variables
var scene, camera, renderer;

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
  camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 1, 3000);
  camera.position.set(0,0,250);
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


// Declare icosaMeshes and icosaGeometries globally
var icosaMeshes = [];
var icosaGeometries = [];

// Initialize all the starting geometry
function initGeometry() {

  var cubeDimension = 4; // TODO: this variable should eventually be set by user input
  var numGeoms = Math.pow(cubeDimension, 3);
  var initIcosaRadius = 20;

  // Create numGeoms different icosahedron geometries with different colors
  for (var i = 0; i < numGeoms; i++){
    icosaGeometries.push(new THREE.IcosahedronGeometry( initIcosaRadius ));

    // Give a random hue to every face on the geometry
    for ( var j = 0; j < icosaGeometries[i].faces.length; j++){
      var hue = Math.random();
      icosaGeometries[i].faces[j].color.setHSL(hue, 1.0, 0.7);
    }
  }

  // Create a mesh for each geometry, one for each icosahedron geometry, and add them to the scene
  for (var i = 0; i < icosaGeometries.length; i++){
    icosaMeshes.push( new THREE.Mesh( icosaGeometries[i], new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } )));

    scene.add(icosaMeshes[i]);
  }

  // TODO: Create the algorithm to arrange any cubic amount of meshes into a cube using the translate methods

  /* Cubic translation method that does not actually make a cube */
  if (icosaMeshes.length % 2 == 0){ // If there are an even number of meshes

    var icosaDiameter = 2 * initIcosaRadius;

    for (i = 0; i < icosaMeshes.length; i++){

      var octant = (i%8) + 1; // Which octant to place the object in
      var layer = (i / 8) + 1; // Which layer of the cube to place in (going from center outward)
      var posMov = layer * icosaDiameter; // How much to translate the object by postively
      var negMov = posMov * -1; // How much to translate the object by negatively
      switch (octant) {
        case 1:
          icosaMeshes[i].translateX(posMov);
          icosaMeshes[i].translateY(posMov);
          icosaMeshes[i].translateZ(posMov);
          break;
        case 2:
          icosaMeshes[i].translateX(negMov);
          icosaMeshes[i].translateY(posMov);
          icosaMeshes[i].translateZ(posMov);
          break;
        case 3:
          icosaMeshes[i].translateX(negMov);
          icosaMeshes[i].translateY(negMov);
          icosaMeshes[i].translateZ(posMov);
          break;
        case 4:
          icosaMeshes[i].translateX(posMov);
          icosaMeshes[i].translateY(negMov);
          icosaMeshes[i].translateZ(posMov);
          break;
        case 5:
          icosaMeshes[i].translateX(posMov);
          icosaMeshes[i].translateY(posMov);
          icosaMeshes[i].translateZ(negMov);
          break;
        case 6:
          icosaMeshes[i].translateX(negMov);
          icosaMeshes[i].translateY(posMov);
          icosaMeshes[i].translateZ(negMov);
          break;
        case 7:
          icosaMeshes[i].translateX(negMov);
          icosaMeshes[i].translateY(negMov);
          icosaMeshes[i].translateZ(negMov);
          break;
        case 8:
          icosaMeshes[i].translateX(posMov);
          icosaMeshes[i].translateY(negMov);
          icosaMeshes[i].translateZ(negMov);
        default:
          break;
      }
    }

    // TODO: Geometries not placing evenly, also fix to form a cube

    /* An actual working cubic translation method */




  } else { // If there is an odd number of meshes

  }

  /* ------ Old translation method --------
  // Translate meshes based on how many there are
  for (var i = 0; i < icosaMeshes.length; i++){

    // Only translate meshes if there's more than one
    if (icosaMeshes.length > 1) {
      if (i < ((icosaMeshes.length) / 2)){
        icosaMeshes[i].translateX((i+1) * (-50));
      } else {
        icosaMeshes[i].translateX((icosaMeshes.length-i) * 50);
      }
    }

  }*/



  /* NUMBER LABELS
   * Adds a corresponding number (textGeometry) above each icosahedron
   */
  var loader = new THREE.FontLoader();
  loader.load( '../fonts/gentilis_regular.typeface.json', function ( font ) {

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
      scene.add(textMesh);

      // Position each number above its respective icosahedron and then translate it up by 50
      textMesh.position.setFromMatrixPosition(icosaMeshes[i].matrix);
      textMesh.translateY(50);

    }
  });

  var axesHelper = new THREE.AxesHelper( 50 );
  scene.add( axesHelper );

}

// Declare vertexPositions as a global variable to be used by getOriginalVertexPositions() and getNewVertices()
var vertexPositions = [];

// Save original icosahedron position
function getOriginalVertexPositions(geom) {

  // go through each vertex geometry and store their position in an Array
  for (var i = 0, l = geom.vertices.length; i < l; i++) {
    vertexPositions.push({x: geom.vertices[i].x, y: geom.vertices[i].y});
  }

  return vertexPositions;
}

// New vertices for tween
function getNewVertices(geom) {
  /* this function returns an array of vertice positions which are randomised
  from the original vertice position */
  var newVertices = [];
  var originalVertexPositions = getOriginalVertexPositions(geom);
  for (var i = 0, l = geom.vertices.length; i<l; i++) {
    newVertices[i] = {
      x: originalVertexPositions[i].x -(geom.parameters.radius / 4) + Math.random()*(geom.parameters.radius / 2),
      y: originalVertexPositions[i].y -(geom.parameters.radius / 4) + Math.random()*(geom.parameters.radius / 2)
    }
  }
  return newVertices;
}

// Tween geometry function
function tweenIcosahedron(geom) {
  var newVertexPositions = getNewVertices(geom);
  // tween each vertice to their new position
  for (var i = 0; i < geom.vertices.length; i++) {
    tweenVertex(i, newVertexPositions, geom);
  }
}

// Tween vertex function
function tweenVertex(i, newVertexPositions, geom) {
  // set the tween
  TweenLite.to(geom.vertices[i], 1, {x: newVertexPositions[i].x, y: newVertexPositions[i].y, ease: Back.easeInOut, onComplete: function() {
    // start the icosahedron tween again now the animation is complete
    if (i === 0) tweenIcosahedron(geom);
  }});
}

// Tween the icosahedron icosahedron geometries
function startTween(){
  // Store original vertex positions of each icosahedron geometry
  for (var i = 0; i < icosaGeometries.length; i++){
    getOriginalVertexPositions(icosaGeometries[i]);
    tweenIcosahedron(icosaGeometries[i]);
  }
}


// Check compatibility, run init functions, and animate
if (Detector.webgl) {
  // Initiate function or other initializations here
  initScene();
  initLighting();
  initGeometry();
  animate();
  startTween();
  addGUI();

} else {
  var warning = Detector.getWebGLErrorMessage();

  document.getElementById('container').appendChild(warning);
}

// DAT GUI CONTROL PANEL

function addGUI() {

  var gui = new dat.GUI();

  var options = {
    scale: 1
  }

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

/*
  controllers[j].onChange(function() {
    console.log(icosaMeshes.length);
    TweenLite.to(icosaMeshes[j].scale, .5, {x: options.scale, y: options.scale, z: options.scale, ease: Back.easeInOut});
  }); */

  /*for (var j = 0; j < icosaMeshes.length; j++) {
    controllers[j].onChange(function() {
      console.log(icosaMeshes.length);
      TweenLite.to(icosaMeshes[j].scale, .5, {x: options.scale, y: options.scale, z: options.scale, ease: Back.easeInOut});
    });
  }*/

}

//}



// Renders the scene and updates the render as needed
function animate() {

  // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimationFrame(animate);

  // Update vertices of each icosahedron geometry
  for (var i = 0; i < icosaGeometries.length; i++){
    icosaGeometries[i].verticesNeedUpdate = true;
  }

  // Render the scene
  renderer.render(scene, camera);
  controls.update();
}



// ]]>
