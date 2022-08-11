const AWS = require('aws-sdk');

export const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.REACT_APP_FILEBASE_ACCESS_ID,
    secretAccessKey: process.env.REACT_APP_FILEBASE_SECRET_ACCESS_KEY,
    endpoint: 'https://s3.filebase.com',
    region: 'us-east-1',
    s3ForcePathStyle: true
});

