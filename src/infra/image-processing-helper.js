const { default: axios } = require('axios')
const sharp = require('sharp')

module.exports = {
  async getImageFromURL (url) {
    return (await axios({ url, responseType: 'arraybuffer' })).data
  },
  overlayPhoto (baseImage, newImage, index) {
    const left = index % 1000
    const top = Math.floor(index / 1000)
    const image = sharp(baseImage)
    image.composite([{ input: newImage, top, left }])
    return image
  },
  resizeImage (image) {
    return image.resize(10, 10).toBuffer()
  }
}
