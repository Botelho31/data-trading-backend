const AWS = require('aws-sdk');

AWS.config.update({
  aws_remote_config: {
    accessKeyId: process.env.USER_KEY,
    secretAccessKey: process.env.USER_SECRET_KEY,
    region: process.env.AWS_REGION,
  },
  accessKeyId: process.env.USER_KEY,
  secretAccessKey: process.env.USER_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  async create(table, json) {
    const params = {
      TableName: table,
      Item: json,
    };

    const data = await docClient.put(params).promise();
    return new Promise((resolve) => resolve(data));
  },
  async update(table, queryParams) {
    const params = {
      TableName: table,
      ...queryParams,
    };

    const data = await docClient.update(params).promise();
    return new Promise((resolve) => resolve(data));
  },
  async scan(table) {
    const params = {
      TableName: table,
    };
    const data = await docClient.scan(params).promise();
    const finalData = await module.exports.performCompleteQuery(data, params);
    return new Promise((resolve) => resolve(finalData.Items));
  },
  async performCompleteQuery(data, params) {
    const dataList = [data];
    while ('LastEvaluatedKey' in dataList[dataList.length - 1]) {
      params.ExclusiveStartKey = dataList[dataList.length - 1].LastEvaluatedKey;
      const newData = await docClient.query(params).promise();
      dataList.push(newData);
    }
    const finalData = {
      Items: [],
      Count: 0,
      ScannedCount: 0,
    };
    for (let i = 0; i < dataList.length; i += 1) {
      finalData.Items.push(...dataList[i].Items);
      finalData.Count += dataList[i].Count;
      finalData.ScannedCount += dataList[i].ScannedCount;
    }
    return new Promise((resolve) => resolve(data));
  },
  async queryTableWhereId(table, idName, id) {
    const params = {
      TableName: table,
      KeyConditionExpression: `${idName} = :id`,
      ScanIndexForward: false,
      ExpressionAttributeValues: {
        ':id': id,
      },
      Limit: 1,
    };
    const data = await docClient.query(params).promise();
    return new Promise((resolve) => resolve(data.Items[0]));
  },
  async queryTableWithParams(table, queryParams) {
    const params = {
      TableName: table,
      ...queryParams,
    };
    const data = await docClient.query(params).promise();
    const finalData = await module.exports.performCompleteQuery(data, params);
    return new Promise((resolve) => resolve(finalData));
  },
  getRandomKey() {
    const CUSTOMEPOCH = 1300000000000; // artificial epoch
    let ts = Number(new Date().getTime() - CUSTOMEPOCH);// limit to recent
    const randid = Math.floor(Math.random() * 512);
    ts *= 64;// bit-shift << 6
    ts += 1;
    return String((ts * 512) + randid);
  },
};
