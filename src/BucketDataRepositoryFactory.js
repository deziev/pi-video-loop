const config = require('config');
const { lstatSync, writeFileSync } = require('fs');
const { BucketDataRepository } = require('./BucketDataRepository');

class BucketDataRepositoryFactory {
  static async create() {
    const repoPath = config.get('bucketMetaDataRepo');
    try {
      const isDirectory = lstatSync(repoPath).isDirectory();
      if (isDirectory) {
        throw new Error(`Unnable to rm ${repoPath} is directory`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      console.warn(`No such file: ${repoPath}`);
      console.warn('Creating new repo');
      writeFileSync(repoPath, '[]');
    }
    return new BucketDataRepository(repoPath);
  }
}

module.exports = {
  BucketDataRepositoryFactory
};
