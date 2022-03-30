module.exports = {
  s3: {
    bucket: process.env.S3_BUCKET,
    key: process.env.S3_ACCESS_KEY,
    secret: process.env.S3_SECRET_ACCESS_KEY
  },
  destFileDir: '/var/pivideoloop/vids/',
  videoPathsFile: '/var/pivideoloop/paths.sh',
  bucketMetaDataRepo: '/var/pivideoloop/.bucket-etag-repo.json',
  videoloopProcess: '/etc/init.d/videoloop'
}