const fs = require('fs')
const path = require('path')
const helpers = require('./lib/helpers')

const totalCubes = 999
const hues = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']
const cubes = []
const cubeNums = [
  {
    numCubes: 1,
    numFrequency: 70,
  },
  {
    numCubes: 2,
    numFrequency: 15,
  },
  {
    numCubes: 3,
    numFrequency: 5,
  },
  {
    numCubes: 4,
    numFrequency: 4,
  },
  {
    numCubes: 5,
    numFrequency: 3,
  },
  {
    numCubes: 6,
    numFrequency: 2,
  },
  {
    numCubes: 7,
    numFrequency: 1,
  },
]
const json = { cubes: [] }

// build cube number map
for (let i = 0; i < cubeNums.length; i++) {
  for (let j = 0; j < cubeNums[i].numFrequency; j++) {
    cubes.push(cubeNums[i].numCubes)
  }
}

// generate space cubes
console.log('**Generating space cubes**')
console.log('--------------------------\r\n')
for (let i = 0; i < totalCubes; i++) {
  const hue = hues[helpers.random(0, hues.length - 1)]
  const cubesNum = cubes[helpers.random(0, cubes.length - 1)]

  console.log(`New Space Cube: ${i}`)
  console.log(`Hue: ${hue}\r\nCubes: ${cubesNum}\r\n `)

  json.cubes.push({
    id: i,
    color: hue,
    cubes: cubesNum,
  })

  fs.mkdir('./dist/', () => {
    fs.mkdir('./dist/cubes/', () => {
      fs.mkdir(`./dist/cubes/${i}/`, () => {
        helpers.copyFolderRecursiveSync(
          './template/js',
          path.join(__dirname, `./dist/cubes/${i}/`)
        )
        helpers.copyFolderRecursiveSync(
          './template/lib',
          path.join(__dirname, `./dist/cubes/${i}/`)
        )
        helpers.copyFolderRecursiveSync(
          './template/css',
          path.join(__dirname, `./dist/cubes/${i}/`)
        )
        helpers.copyFileSync(
          './template/index.html',
          path.join(__dirname, `./dist/cubes/${i}/`)
        )

        fs.readFile(
          path.join(__dirname, `./dist/cubes/${i}/js/index.js`),
          'utf8',
          (err, data) => {
            // console.log(`Overwriting HUE / CUBES variables for cube ${i}`)
            let rendered = data.replace('{% HUE %}', `'${hue}'`)
            rendered = rendered.replace('{% CUBES %}', cubesNum)

            fs.writeFile(
              path.join(__dirname, `./dist/cubes/${i}/js/index.js`),
              rendered,
              (err) => {
                if (err) {
                  console.log(err)
                }
              }
            )
          }
        )
      })
    })
  })
}

hues.map((hue) => {
  console.log(
    `Generated ${hue} cubes: ${
      json.cubes.filter((cube) => {
        return cube.color === hue
      }).length
    }`
  )
})

for (let i = 1; i < 8; i++) {
  console.log(
    `Generated ${i} cubes: ${
      json.cubes.filter((cube) => {
        return cube.cubes === i
      }).length
    }`
  )
}

fs.writeFile(
  path.join(__dirname, `./dist/meta.json`),
  JSON.stringify(json),
  (err) => {
    if (err) {
      console.log(err)
    }
  }
)

console.log(`\r\n**Capturing Screenshots**`)
console.log('-------------------------\r\n')

helpers.captureScreens(json.cubes)
