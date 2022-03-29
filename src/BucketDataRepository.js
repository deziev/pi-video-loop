const { FileRepository } = require('./FileRepository');

class BucketDataRepository extends FileRepository {
  async findByEtag(etag) {
    const data = this.getData();
    return data.filter(it => it.etag === etag);
  }

  async save(record) {
    return await this.saveRecord(record);
  }
}

module.exports = {
  BucketDataRepository
};
