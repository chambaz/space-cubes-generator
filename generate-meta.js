const fs = require('fs')
const path = require('path')
const meta = require('./dist/meta.json')

meta.cubes.map((cube) => {
  fs.mkdir('./dist/meta/', () => {
    fs.writeFile(
      path.join(__dirname, `./dist/meta/${cube.id}`),
      JSON.stringify({
        description:
          'Space Cubes is a collection of 999 interactive NFTs created by chambaz.eth (@chambaz)',
        image: `ipfs://QmcGJWJYFt8iwYSCHdRcoXPHj7f6RYmuNqdHhiiiTwhzfj/${cube.id}/image.png`,
        animation_url: `https://spacecubes.mypinata.cloud/ipfs/QmcGJWJYFt8iwYSCHdRcoXPHj7f6RYmuNqdHhiiiTwhzfj/${cube.id}/index.html`,
        name: `Space Cube #${cube.id}`,
        attributes: [
          { trait_type: 'Color', value: cube.color },
          { trait_type: 'Cubes', value: Math.pow(cube.cubes, 3).toString() },
        ],
      }),
      (err) => {
        if (err) {
          console.log(err)
        }
      }
    )
  })
})
