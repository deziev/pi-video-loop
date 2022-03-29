const path = require('path');
const EasyYandexS3 = require("easy-yandex-s3");
const config = require('config');
const {
  ConsoleLogger,
  BucketDataRepositoryFactory,
  createBucketMetaDataRecord
} = require('./src/index');


async function main() {
  const logger = new ConsoleLogger();
  logger.info('Checking for new records');

  const videoMetaDataRepo = await BucketDataRepositoryFactory.create();
  const s3 = new EasyYandexS3({
    auth: {
      accessKeyId: config.get('s3').key,
      secretAccessKey: config.get('s3').secret,
    },
    Bucket: config.get('s3').bucket,
    // debug: true
  });

  const savedDataEtagList = (await videoMetaDataRepo.getData()).map(it => it.etag);
  const list = (await s3.GetList()).Contents
    .filter(it => it.Key.match(/video(1|2)/))
    .filter(it => !savedDataEtagList.includes(it.ETag))
    .map(createBucketMetaDataRecord);

  if (!list.length) {
    logger.warn(`New records not found`);
    logger.warn(`Aborting`);
    process.exit(0);
  }

  if (list.length !== 2) {
    logger.warn(`Found only one new record: ${JSON.stringify(list, null, 2)}`);
    logger.warn(`Aborting`);
    process.exit(0);
  }
  const filesToDownload = list.map(it => it.key);
  const downloadDir = config.get('destFileDir');
  const downloads = filesToDownload
    .map((fileName, index) => {
      const destFilePath = path.resolve(downloadDir, `video${index + 1}${path.parse(fileName).ext}`);
      return s3.Download(
        fileName,
        destFilePath
      )
    });
  logger.info(`Start downloading files [${filesToDownload.join(', ')}]`);
  await Promise.all(downloads);
  logger.info(`Done downloading into ${downloadDir}`);

  await videoMetaDataRepo.saveRecords(list);
  logger.info(list);
  // reboot videoloop
}

main();
