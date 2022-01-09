const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

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
      width: 1080,
      height: 1080,
    })

    for (const { id } of cubes) {
      // console.log(
      //   'file://' + path.join(__dirname, `./dist/cubes/${id}/index.html`)
      // )
      await page.goto(
        'file://' + path.join(__dirname, `../dist/cubes/${id}/index.html`)
      )
      await page.waitForTimeout(3000)
      await page.screenshot({ path: `./dist/cubes/${id}/image.png` })
      console.log(`Screenshot captured: ${id}`)
      await page.waitForTimeout(500)
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

exports.random = random
exports.copyFileSync = copyFileSync
exports.copyFolderRecursiveSync = copyFolderRecursiveSync
exports.captureScreens = captureScreens
