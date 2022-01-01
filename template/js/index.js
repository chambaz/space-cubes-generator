function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = canvas.width !== width || canvas.height !== height
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const query = new URLSearchParams(location.search)

const hue = {% HUE %} || 'blue'
const cubesNum = Number({% CUBES %} || 1)

function bg() {
  const canvas = document.querySelector('#bg')
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
  renderer.setClearColor(0xffffff, 0)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )

  const randomBlueRgb = randomColor.bind(null, {
    hue,
    format: 'rgbArray',
  })

  const sNoise = document.querySelector('#snoise-function').textContent
  const bgGeo = new THREE.PlaneGeometry(
    window.innerWidth / 2,
    window.innerHeight / 2,
    100,
    100
  )
  const bgMat = new THREE.ShaderMaterial({
    uniforms: {
      u_bg: { type: 'v3', value: new THREE.Vector3(...randomBlueRgb()) },
      u_bgMain: { type: 'v3', value: new THREE.Vector3(...randomBlueRgb()) },
      u_color1: { type: 'v3', value: new THREE.Vector3(...randomBlueRgb()) },
      u_color2: { type: 'v3', value: new THREE.Vector3(...randomBlueRgb()) },
      u_time: { type: 'f', value: 0 },
      u_randomisePosition: { type: 'v2', value: new THREE.Vector2(1, 2) },
    },
    fragmentShader:
      sNoise + document.querySelector('#fragment-shader').textContent,
    vertexShader: sNoise + document.querySelector('#vertex-shader').textContent,
  })

  let bg = new THREE.Mesh(bgGeo, bgMat)
  bg.position.set(0, 140, -280)
  bg.scale.multiplyScalar(5)
  bg.rotationX = -1.0
  bg.rotationY = 0.0
  bg.rotationZ = 0.1
  scene.add(bg)

  function R(x, y, t) {
    return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t))
  }

  function G(x, y, t) {
    return Math.floor(
      192 +
        64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
    )
  }

  function B(x, y, t) {
    return Math.floor(
      192 +
        64 *
          Math.sin(
            5 * Math.sin(t / 9) +
              ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
          )
    )
  }

  let t = 0
  let j = 0
  let x = random(0, 32)
  let y = random(0, 32)
  let vCheck = false

  // render 🚀
  function render(time) {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    bg.material.uniforms.u_randomisePosition.value = new THREE.Vector2(j, j)

    bg.material.uniforms.u_color1.value = new THREE.Vector3(
      R(x, y, t / 2),
      G(x, y, t / 2),
      B(x, y, t / 2)
    )

    bg.material.uniforms.u_time.value = t
    if (t % 0.1 == 0) {
      if (vCheck == false) {
        x -= 1
        if (x <= 0) {
          vCheck = true
        }
      } else {
        x += 1
        if (x >= 32) {
          vCheck = false
        }
      }
    }

    j = j + 0.01
    t = t + 0.05

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

function fg() {
  const canvas = document.querySelector('#fg')
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
  renderer.setClearColor(0xffffff, 0)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )

  camera.position.set(0, 0, 10)

  const controls = new THREE.OrbitControls(camera, renderer.domElement)

  controls.autoRotate = true
  controls.enableDamping = true

  const randomCol = randomColor.bind(null, {
    hue,
    luminosity: 'light',
  })

  const cubeGroup = new THREE.Object3D()
  const cubes = []

  let z,
    h,
    v = 1
  const boxSize = 2.4
  const boxSizeOuter = 2.95
  const cubesLoop = cubesNum + 1
  let cameraZoom = 0

  switch (cubesNum) {
    case 1:
      camera.position.set(0, 0, 10)
      break
    case 2:
      camera.position.set(0, 0, 17)
      break
    case 3:
      camera.position.set(0, 0, 22)
      break
    case 4:
      camera.position.set(0, 0, 30)
      break
    case 5:
      camera.position.set(0, 0, 35)
      break
    case 6:
      camera.position.set(0, 0, 40)
      break
    case 7:
      camera.position.set(2, 0, 45)
      break
  }

  for (z = 1; z < cubesLoop; z++) {
    for (v = 1; v < cubesLoop; v++) {
      for (h = 1; h < cubesLoop; h++) {
        const cubeGeo = new THREE.BoxBufferGeometry(
          boxSize,
          boxSize,
          boxSize,
          2,
          2,
          2
        )
        const cube = new THREE.Mesh(cubeGeo, [
          new THREE.MeshLambertMaterial({
            color: randomCol(),
          }),
          new THREE.MeshLambertMaterial({
            color: randomCol(),
          }),
          new THREE.MeshLambertMaterial({
            color: randomCol(),
          }),
          new THREE.MeshLambertMaterial({
            color: randomCol(),
          }),
          new THREE.MeshLambertMaterial({
            color: randomCol(),
          }),
          new THREE.MeshLambertMaterial({
            color: randomCol(),
          }),
        ])
        cube.position.set(h * boxSizeOuter, v * boxSizeOuter, z * boxSizeOuter)

        cubeGroup.add(cube)
        cubes.push(cube)
      }
    }
  }

  const cubeGroupContainer = new THREE.Box3().setFromObject(cubeGroup)
  cubeGroupContainer.center(cubeGroup.position)
  cubeGroup.position.multiplyScalar(-1)

  const cubeGroupPivot = new THREE.Group()
  cubeGroupPivot.rotation.x = 0.5
  cubeGroupPivot.rotation.y = 0.97

  switch (cubesNum) {
    case 1:
      cubeGroupPivot.position.y = 0
      break
    case 2:
      cubeGroupPivot.position.y = 0.3
      break
    case 3:
      cubeGroupPivot.position.y = 0.7
      break
    case 4:
      cubeGroupPivot.position.y = 1
      break
    case 5:
      cubeGroupPivot.position.y = 1.3
      break
    case 6:
      cubeGroupPivot.position.y = 1.7
      break
    case 7:
      cubeGroupPivot.position.y = 2
      break
  }

  scene.add(cubeGroupPivot)
  cubeGroupPivot.add(cubeGroup)

  const lights = [
    new THREE.PointLight(randomCol(), random(0.5, 0.7)),
    new THREE.PointLight(randomCol(), random(0.5, 0.7)),
    new THREE.PointLight(randomCol(), random(0.5, 0.7)),
    new THREE.PointLight(randomCol(), random(0.5, 0.7)),
    new THREE.PointLight(randomCol(), random(0.5, 0.7)),
    new THREE.PointLight(randomCol(), random(0.5, 0.7)),
  ]

  const lightHelpers = [
    new THREE.PointLightHelper(lights[0]),
    new THREE.PointLightHelper(lights[1]),
    new THREE.PointLightHelper(lights[2]),
    new THREE.PointLightHelper(lights[3]),
    new THREE.PointLightHelper(lights[4]),
    new THREE.PointLightHelper(lights[5]),
  ]

  lights[0].position.set(8, 8, 0)
  lights[1].position.set(-8, 8, 0)
  lights[2].position.set(8, -8, 0)
  lights[3].position.set(-8, -8, 0)
  lights[4].position.set(0, 0, 10)
  lights[5].position.set(0, 0, -10)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)

  scene.add(ambientLight)

  lights.map((light) => {
    scene.add(light)
  })

  // lightHelpers.map((helper) => {
  //   scene.add(helper)
  // })

  // render 🚀
  function render(time) {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

fg()
bg()
