const fs = require('fs')
const path = require('path')
const cubesJSON = require('./dist/meta.json')
const helpers = require('./lib/helpers')

cubesJSON.cubes.forEach((cube) => {
  fs.mkdir('./dist/cube-images', () => {
    fs.mkdir(`./dist/cube-images/${cube.cubes}`, () => {
      helpers.copyFileSync(
        `./dist/cubes/${cube.id}/image.png`,
        path.join(
          __dirname,
          `./dist/cube-images/${cube.cubes}/image-${cube.id}.png`
        )
      )
    })
  })
})
