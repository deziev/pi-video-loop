# Raspberry pi Video loop

### Usage
Prepare SD card with Raspberry Pi Imager. Select `Raspberry Pi OS Lite (Legacy)` OS. Set username as `pi-video` and password. Select your default wifi network and enable SSH connection.

Prepare directory `/var/pivideoloop/` to use as video storage.
```
sudo mkdir /var/pivideoloop
sudo chown pi-video /var/pivideoloop
sudo mkdir /var/pivideoloop/vids
```
Create `/var/pivideoloop/env.sh` file to store secret env variables
```
touch /var/pivideoloop/env.sh
```

After environment preparation you could run the node.js script
```
cd /var/pivideoloop/pi-video-loop
bin/environment node index.js
```

Optionally run:
```
sudo apt-get update
sudo apt-get dist-upgrade
```

#### Step 1: Install Omxplayer & Screen
```
sudo apt-get install omxplayer
sudo apt-get install screen
sudo apt-get install parallel
```

#### Step 2: Create a script to start and stop the Video Loop
In this step, we will create a script to start, stop, and repair the video loop. The following command will open the nano editor and create a file called videoloop in the /etc/init.d directory.

```
sudo nano /etc/init.d/videoloop
```

This script `videoloop` will look for a video file called video.mp4 in the /home/pi-video directory

#### Step 3: Change the permission of the videoloop script
In order for the script to be executable, we need to change its file permissions. We do so with the following command.
```
sudo chmod 755 /etc/init.d/videoloop
```

#### Step 4: Test the script
Run the following commands to confirm the script is running properly.

Start the video loop:
```
/etc/init.d/videoloop start
```

Close the video loop:
```
/etc/init.d/videoloop stop
```

Re-open the video loop if it closes:
```
/etc/init.d/videoloop repair
```

If the video fails to run, check that the path and file name are correct. Remember Linux is case sensitive.

#### Step 5: Update the rc.d file to initilization the script on statup
To have the script start the video loop each time the pi boots up, we use the following command.
```
sudo update-rc.d videoloop defaults
```

#### Step 7: (OPTIONAL) Increase the GPU memory

If you experience poor playback, you may need to increase the GPU memory allocation. The ratio needed will depend on size and quality of the video and version of Pi you'll be using. Using a Pi 3 with a large file, I found increasing the GPU memory to 256 smoothed out some performance issues that crept in towards the end of the day.
```
sudo raspi-config
```

`Performance Options -> GPU Memory -> 256`

#### Step 7: Install Node.js

Download and install LTS arm7 node
```
wget https://nodejs.org/dist/v16.14.2/node-v16.14.2-linux-armv7l.tar.xz
sudo tar xvf node-v16.14.2-linux-armv7l.tar.xz -C /opt
cd /opt
sudo mv -v node-v16.14.2-linux-armv7l.tar.xz node
sudo ln -s /opt/node/bin/node /usr/bin/node
sudo ln -s /opt/node/bin/npm /usr/bin/npm
sudo reboot
```