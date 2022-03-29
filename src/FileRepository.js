const { writeFileSync } = require("fs");

class FileRepository {
  constructor(path) {
    this.path = path;
  }

  async getData() {
    return require(this.path);
  }

  async saveRecord(record) {
    const data = await this.getData();
    data.push(record);
    writeFileSync(this.path, JSON.stringify(data, null, 2));
    return record;
  }

  async saveRecords(recordList) {
    let data = await this.getData();
    data = data.concat(recordList);
    writeFileSync(this.path, JSON.stringify(data, null, 2));
    return recordList;
  }

  async clear() {
    writeFileSync(this.path, JSON.stringify([], null, 2));
  }

}

module.exports = {
  FileRepository
};