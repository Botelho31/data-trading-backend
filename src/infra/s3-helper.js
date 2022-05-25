const AWS = require('aws-sdk');

AWS.config.update({ region: 'sa-east-1' });

const BUCKET_NAME = process.env.BUCKET_NAME;
const IAM_USER_KEY = process.env.USER_KEY;
const IAM_USER_SECRET = process.env.USER_SECRET_KEY;

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

module.exports = {
  getLink() {
    return '';
  },
  uploadToS3(fileName, fileBody) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBody,
    };

    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  },
  listFromS3(prefix) {
    const options = {
      Bucket: BUCKET_NAME,
      Delimiter: '',
      Prefix: prefix,
    };
    return s3bucket.listObjects(options).promise();
  },
  headObjectS3(fileName) {
    const options = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };
    return s3bucket.headObject(options).promise();
  },
  uploadImageToS3(fileName, fileBody) {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBody,
      ContentType: 'image/png',
    };

    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    });
  },
  downloadFromS3(fileName) {
    const options = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };
    return s3bucket.getObject(options).promise();
  },
  encode(data) {
    const buf = Buffer.from(data);
    const base64 = buf.toString('base64');
    return base64;
  },
  decode(data) {
    const buff = Buffer.from(data, 'base64');
    return buff;
  },
};
