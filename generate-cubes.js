const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const totalCubes = 2
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

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const copyFileSync = (source, target) => {
  let targetFile = target

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source))
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source))
}

const copyFolderRecursiveSync = (source, target) => {
  let files = []

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source))
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder)
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source)
    files.forEach(function (file) {
      var curSource = path.join(source, file)
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder)
      } else {
        copyFileSync(curSource, targetFolder)
      }
    })
  }
}

const captureScreens = async (cubes) => {
  let browser = null

  try {
    // launch headless Chromium browser
    browser = await puppeteer.launch({
      headless: true,
    })
    // create new page object
    const page = await browser.newPage()

    // set viewport width and height
    await page.setViewport({
      width: 1440,
      height: 1080,
    })

    for (const { id } of cubes) {
      // console.log(
      //   'file://' + path.join(__dirname, `./dist/cubes/${id}/index.html`)
      // )
      await page.goto(
        'file://' + path.join(__dirname, `./dist/cubes/${id}/index.html`)
      )
      await page.waitForTimeout(3000)
      await page.screenshot({ path: `./dist/cubes/${id}/image.png` })
      // console.log(`Screenshot: ${id}`)
    }
  } catch (err) {
    console.log(`Screenshot Error: ${err.message}`)
  } finally {
    if (browser) {
      await browser.close()
    }
    console.log(`${cubes.length} screenshots captured.`)
  }
}

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
  const hue = hues[random(0, hues.length - 1)]
  const cubesNum = cubes[random(0, cubes.length - 1)]

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
        copyFolderRecursiveSync(
          './template/js',
          path.join(__dirname, `./dist/cubes/${i}/`)
        )
        copyFolderRecursiveSync(
          './template/lib',
          path.join(__dirname, `./dist/cubes/${i}/`)
        )
        copyFolderRecursiveSync(
          './template/css',
          path.join(__dirname, `./dist/cubes/${i}/`)
        )
        copyFileSync(
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
captureScreens(json.cubes)
