const fs = require('fs')
const path = require('path')
const cubesJSON = require('./dist/meta.json')

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

cubesJSON.cubes.forEach((cube) => {
  fs.mkdir('./dist/cube-images', () => {
    fs.mkdir(`./dist/cube-images/${cube.cubes}`, () => {
      copyFileSync(
        `./dist/cubes/${cube.id}/image.png`,
        path.join(
          __dirname,
          `./dist/cube-images/${cube.cubes}/image-${cube.id}.png`
        )
      )
    })
  })
})
