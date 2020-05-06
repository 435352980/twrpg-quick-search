import * as vec3 from 'gl-matrix/vec3';
import * as quat from 'gl-matrix/quat';
import Scene from 'mdx-m3-viewer/src/viewer/scene';

interface CameraOptions {
  moveSpeed?: number;
  rotationSpeed?: number;
  zoomFactor?: number;
  horizontalAngle?: number;
  verticalAngle?: number;
  distance?: number;
  target?: Float32Array;
  worldUp?: Float32Array;
}

// const glMatrix = ModelViewer.common.glMatrix;
// const vec3 = glMatrix.vec3;
// const quat = glMatrix.quat;

// An orbit camera setup example.
// Left mouse button controls the orbit itself.
// The right mouse button allows to move the camera and the point it's looking at on the XY plane.
// Scrolling zooms in and out.
function setupCamera(scene: Scene, options: CameraOptions = {}) {
  const canvas = scene.viewer.canvas;
  const camera = scene.camera;
  // Movement per pixel of movement.
  const moveSpeed = options.moveSpeed || 0.5;
  // Rotation in radians per pixel of movement.
  const rotationSpeed = options.rotationSpeed || 1 / 100;
  // Zoom factor per scroll.
  const zoomFactor = (options.zoomFactor = 0.05);
  let horizontalAngle = options.horizontalAngle || Math.PI / 2;
  let verticalAngle = options.verticalAngle || Math.PI / 4;
  let distance = options.distance || 500;
  const position = vec3.create();
  // What the camera is looking at.
  const target = options.target || vec3.create();
  // What is considered "up" to this camera.
  const worldUp = options.worldUp || vec3.fromValues(0, 0, 1);
  const mouse = { buttons: [false, false, false], x: 0, y: 0, x2: 0, y2: 0 };

  const vecHeap = vec3.create();
  const quatHeap = quat.create();
  camera.move([0, -1000, 0]);

  function update() {
    // Limit the vertical angle so it doesn't flip.
    // Since the camera uses a quaternion, flips don't matter to it, but this feels better.
    verticalAngle = Math.min(Math.max(0.01, verticalAngle), Math.PI - 0.01);

    quat.identity(quatHeap);
    quat.rotateZ(quatHeap, quatHeap, horizontalAngle);
    quat.rotateX(quatHeap, quatHeap, verticalAngle);

    vec3.set(position, 0, 0, 1);
    vec3.transformQuat(position, position, quatHeap);
    vec3.scale(position, position, distance);
    vec3.add(position, position, target);

    camera.moveToAndFace(position, target, worldUp);
  }

  update();

  // Move the camera and the target on the XY plane.
  function move(x: number, y: number) {
    const dirX = camera.directionX;
    const dirY = camera.directionY;

    // Allow only movement on the XY plane, and scale to moveSpeed.
    vec3.add(
      target,
      target,
      vec3.scale(
        vecHeap,
        vec3.normalize(vecHeap, vec3.set(vecHeap, dirX[0], dirX[1], 0)),
        x * moveSpeed,
      ),
    );
    // vec3.add(target, target, vec3.scale(vecHeap, vec3.normalize(vecHeap, vec3.set(vecHeap, dirY[0], dirY[1], 0)), y * moveSpeed));
    vec3.add(
      target,
      target,
      vec3.scale(
        vecHeap,
        vec3.normalize(vecHeap, vec3.set(vecHeap, dirY[0], dirY[0], 1)),
        y * moveSpeed,
      ),
    );

    update();
  }

  // Rotate the camera around the target.
  function rotate(x: number, y: number) {
    horizontalAngle -= x * rotationSpeed;
    verticalAngle -= y * rotationSpeed;

    update();
  }

  // Zoom the camera by changing the distance from the target.
  function zoom(factor: number) {
    distance *= 1 + factor * zoomFactor;

    update();
  }

  // Resize the canvas automatically and update the camera.
  function onResize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    camera.setViewport(0, 0, canvas.width, canvas.height);

    camera.perspective(Math.PI / 4, canvas.width / canvas.height, 8, 100000);
  }

  window.addEventListener('resize', function() {
    onResize();
  });

  onResize();

  // Disable the context menu when right-clicking.
  canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  canvas.addEventListener('selectstart', function(e) {
    e.preventDefault();
  });

  // Track mouse clicks.
  canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();

    mouse.buttons[e.button] = true;
  });

  // And mouse unclicks.
  // On the whole document rather than the canvas to stop annoying behavior when moving the mouse out of the canvas.
  window.addEventListener('mouseup', e => {
    e.preventDefault();

    mouse.buttons[e.button] = false;
  });

  // Handle rotating and moving the camera when the mouse moves.
  canvas.addEventListener('mousemove', e => {
    mouse.x2 = mouse.x;
    mouse.y2 = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const dx = mouse.x - mouse.x2;
    const dy = mouse.y - mouse.y2;

    if (mouse.buttons[0]) {
      rotate(dx, dy);
    }

    if (mouse.buttons[2]) {
      move(-dx * 2, dy * 2);
    }
  });

  // Handle zooming when the mouse scrolls.
  canvas.addEventListener('wheel', e => {
    e.preventDefault();

    let deltaY = e.deltaY;

    if (e.deltaMode === 1) {
      deltaY = (deltaY / 3) * 100;
    }

    zoom(deltaY / 100);
  });

  // Get the vector length between two touches.
  function getTouchesLength(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  // Touch modes.
  const TOUCH_MODE_INVALID = -1;
  const TOUCH_MODE_ROTATE = 0;
  const TOUCH_MODE_ZOOM = 1;
  let touchMode = TOUCH_MODE_ROTATE;
  const touches = [];

  // Listen to touches.
  // Supports 1 or 2 touch points.
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();

    const targetTouches = e.targetTouches;

    if (targetTouches.length === 1) {
      touchMode = TOUCH_MODE_ROTATE;
    } else if (targetTouches.length === 2) {
      touchMode = TOUCH_MODE_ZOOM;
    } else {
      touchMode = TOUCH_MODE_INVALID;
    }

    touches.length = 0;
    touches.push(...targetTouches);
  });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();

    touchMode = TOUCH_MODE_INVALID;
  });

  canvas.addEventListener('touchcancel', e => {
    e.preventDefault();

    touchMode = TOUCH_MODE_INVALID;
  });

  // Rotate or zoom based on the touch mode.
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();

    const targetTouches = e.targetTouches;

    if (touchMode === TOUCH_MODE_ROTATE) {
      const oldTouch = touches[0];
      const newTouch = targetTouches[0];
      const dx = newTouch.clientX - oldTouch.clientX;
      const dy = newTouch.clientY - oldTouch.clientY;

      rotate(dx, dy);
    } else if (touchMode === TOUCH_MODE_ZOOM) {
      const len1 = getTouchesLength(touches[0], touches[1]);
      const len2 = getTouchesLength(targetTouches[0], targetTouches[1]);

      zoom((len1 - len2) / 50);
    }

    touches.length = 0;
    touches.push(...targetTouches);
  });
}

export default setupCamera;
