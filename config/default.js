module.exports = {
  s3: {
    bucket: process.env.S3_BUCKET,
    key: process.env.S3_ACCESS_KEY,
    secret: process.env.S3_SECRET_ACCESS_KEY
  },
  destFileDir: '/opt/vids/',
  bucketMetaDataRepo: '/opt/.bucket-etag-repo.json'
}