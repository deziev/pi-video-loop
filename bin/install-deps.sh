#!/bin/bash

node_version=v16.14.2
node_package=node-$node_version-linux-armv7l

sudo mkdir -p /var/pivideoloop
sudo chown -R pi-video /var/pivideoloop
sudo mkdir /var/pivideoloop/vids

sudo apt-get update -y
sudo apt-get dist-upgrade -y
sudo apt-get install omxplayer -y
sudo apt-get install screen -y
sudo apt-get install parallel -y

echo "[INSTALL] Downloading node js"
sudo wget https://nodejs.org/dist/$node_version/$node_package.tar.xz
echo "[INSTALL] Unpacking..."
sudo tar xvf $node_package.tar.xz -C /opt
sudo rm $node_package.tar.xz
cd /opt
echo "[INSTALL] Linking with /usr/bin"
sudo mv $node_package node
sudo ln -s /opt/node/bin/node /usr/bin/node
sudo ln -s /opt/node/bin/npm /usr/bin/npm
echo "[INSTALL] Done!"

echo "[INSTALL] Reboot the system"
