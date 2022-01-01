const fs = require('fs')
const path = require('path')
const uniqueNamesGenerator = require('unique-names-generator')
const meta = require('./dist/meta.json')

const ipfsUrl = 'ipfs://QmP8AEkpHHMdjfMUH84efNjKtSt75P3LBXkoezwRYgtaxG'

meta.cubes.map((cube) => {
  fs.mkdir('./dist/meta/', () => {
    fs.writeFile(
      path.join(__dirname, `./dist/meta/${cube.id}`),
      JSON.stringify({
        description: 'Space Cube',
        image: `${ipfsUrl}/${cube.id}/image.png`,
        animation_url: `${ipfsUrl}/${cube.id}/index.html`,
        name: uniqueNamesGenerator.uniqueNamesGenerator({
          dictionaries: [
            uniqueNamesGenerator.adjectives,
            [cube.color],
            uniqueNamesGenerator.animals,
          ],
          separator: '-',
        }),
        attributes: [
          { trait_type: 'Color', value: cube.color },
          { trait_type: 'Cubes', value: Math.pow(cube.cubes, 3) },
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
