#!/bin/bash

set -e

dest_dir=/var/pivideoloop
project_name=pi-video-loop
project_dir=$dest_dir/$project_name

rm -rf $project_dir

wget https://github.com/deziev/pi-video-loop/archive/refs/heads/main.zip

uzip main.zip -d $dest_dir
rm main.zip
mv ${dest_dir}/${project_name}-main $project_dir

cd $project_dir

echo "[BUILD] [VIDEO-PI] Installing dependencies"
if [ "$include_dev_deps" = "true" ] || [ -z "$include_dev_deps" ]; then
    npm install
else
    npm install --production
fi

echo "[DEPLOY] [VIDEO-PI] Updating crontabl tasks"
crontab_source_conf="${project_dir}/bin/videoloop.cron"
cat $crontab_source_conf | crontab -
