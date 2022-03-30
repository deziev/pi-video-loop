const path = require('path');
const EasyYandexS3 = require("easy-yandex-s3");
const config = require('config');
const {
  ConsoleLogger,
  BucketDataRepositoryFactory,
  createBucketMetaDataRecord,
  runLinuxCommand
} = require('./src/index');
const { writeFileSync } = require('fs');


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

  const downloadDir = config.get('destFileDir');
  const filesToDownload = list.map((it, index) => ({
    originalName: it.key,
    path: path.resolve(downloadDir, `video${index + 1}${path.parse(it.key).ext}`)
  }));
  const downloads = filesToDownload
    .map(file => s3.Download(file.originalName, file.path));

  logger.info(`Start downloading files [${filesToDownload.map(it => it.originalName).join(', ')}]`);
  await Promise.all(downloads);
  logger.info(`Done downloading into ${downloadDir}`);

  writeFileSync(
    config.get('videoPathsFile'),
    `
    export video_path=${filesToDownload[0].path}
    export video_path2=${filesToDownload[1].path}

    `
  );

  await runLinuxCommand(`chmod +x ${config.get('videoPathsFile')}`);

  // Restart videoloop
  const videoloopProcess = config.get('videoloopProcess');
  if (videoloopProcess) {
    await runLinuxCommand(`${videoloopProcess} stop`);
    await runLinuxCommand(`${videoloopProcess} start`);
  }

  await videoMetaDataRepo.saveRecords(list);
  logger.info(list);
  logger.info('Done!');
}

main();
