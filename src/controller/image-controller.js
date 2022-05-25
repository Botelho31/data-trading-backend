const sharp = require('sharp');
const dynamoHelper = require('../infra/dynamo-helper');
const web3Helper = require('../infra/web3/web3-helper');
const { overlayPhoto } = require('../infra/image-processing-helper');

const tableName = 'image';

module.exports = {
  async create(req, res, next) {
    try {
      const {
        hoverDescription, id, body, link,
      } = req.body;
      const { publicAddress } = req.user;
      const tokenOwner = await web3Helper.tokenOwner(id);
      if (tokenOwner !== publicAddress) {
        return res.status(401).json({ message: 'INVALID_ACCESS' });
      }
      const imgBuffer = Buffer.from(body, 'base64');
      const image = sharp(imgBuffer);
      const imageMetadata = await image.metadata();
      if (imageMetadata.width !== 10 && imageMetadata.height !== 10) {
        return res.status(400).json({ message: 'INVALID_IMAGE_SIZE' });
      }
      const newImage = overlayPhoto('', image, id);
      newImage.png();
      // salvar essa imagem no s3 em formato png

      await dynamoHelper.create(tableName, {
        hoverDescription,
        id,
        link,
      });
      return res.json(req.body);
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await dynamoHelper.queryTableWhereId(tableName, 'id', id);
      return res.json(post);
    } catch (error) {
      return next(error);
    }
  },
};
