function createBucketMetaDataRecord(content) {
  return {
    key: content.Key,
    etag: content.ETag,
    size: content.Size,
    lastModifiedAt: content.LastModified,
    savedAt: new Date()
  };
}

module.exports = {
  createBucketMetaDataRecord
};
