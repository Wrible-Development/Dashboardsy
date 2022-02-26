# Dashboardsy

A modern client panel for the Pterodactyl® panel, made by Wrible Development.   
Support Discord: [https://discord.gg/zVcDkSZNu7](https://discord.gg/zVcDkSZNu7)

## Screenshots
![homepage](https://cdn.discordapp.com/attachments/698854005987868692/937083265637023745/uu71hEpP.png)      
![createserver](https://cdn.discordapp.com/attachments/698854005987868692/937083791917338639/2R7I34rw.png)

## Setting up
This guide is only for debian-based distributions of GNU/Linux.   
This is fairly easy to install, first install NodeJS 16 via the following commands (run them as root):   
```sh
apt-get install curl git nginx software-properties-common 
curl -sL https://deb.nodesource.com/setup_16.x | bash - 
```   
Then we need to install mysql, here's a guide to installing mariadb (skip the admin account step): [https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-ubuntu-20-04](https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-ubuntu-20-04)   
Now create a new user and a database in mariadb using the following commands: First run `mariadb -u root` as the root user to open mariadb. Then enter the following, make sure to change the password to something secure and note it down somewhere.   
```sql
CREATE DATABASE dashboardsy;
CREATE USER 'dashboardsy'@'localhost' IDENTIFIED BY 'thisispassword-changeit';
GRANT ALL PRIVILEGES ON dashboardsy.* TO 'dashboardsy'@'localhost';
FLUSH PRIVILEGES;
```   
Then clone this repository locally using git: `git clone https://github.com/Wrible-Development/Dashboardsy`   
Then cd to the directory where you cloned the repo   
Run `mv .env.example .env`   
Edit next.config.js (only edit the stuff in the env in next.config.js), .env and config.json according to your needs (don't change NEXTAUTH_URL_INTERNAL, only change NEXTAUTH_URL to the website url of your dashboard).   
Go to [discord.dev](https://discord.com/developers/applications) and create a new application, copy the client secret and client ID and put them in next.config.js   
Now select the application on discord.dev and go to the Oauth2 tab and add a redirect url with the value `https://dash.example.com/api/auth/callback/discord` (make sure to change the domain from the example one)   
Now set public/favicon.png to your logo.   
Install the dependencies using npm and install pm2 and build the dashboard:   
```sh
npm install
npm install -g pm2
npm run build
```
Finally to start the dashboard, run the following command `pm2 start --name=dashboardsy npm -- start`   

Now do the following to configure nginx.
`systemctl start nginx`  
`certbot certonly --nginx -d your.domain.com`  
`cd /etc/nginx/conf.d`  
`touch dashboardsy.conf`  
`nano dashboardsy.conf`  
Now paste the following:   
```nginx
server {
    listen 80;
    server_name <domain>;
    return 301 https://$server_name$request_uri;
}
server {
    listen 443 ssl http2;    
    server_name <domain>;
    ssl_certificate /etc/letsencrypt/live/<domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<domain>/privkey.pem;
    ssl_session_cache shared:SSL:10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
    ssl_prefer_server_ciphers on;

    location / {
      proxy_pass http://localhost:3000/;
      proxy_buffering off;
      proxy_set_header X-Real-IP $remote_addr;
  }
}
```  
Make sure to replace `<domain>` with the domain.  
Now run `systemctl restart nginx` and you should be good to go.

### Renewal System

Setting up the renewal system is pretty easy if you have basic linux knowledge.   
Edit config.json, enable the dashboardsy api and set an api key, this api key should be over 32 characters and must not include exclamation marks, Also setup the renewal config if you haven't done that already.   
Then run `echo 'curl -H "Authorization: DASHBOARDSY API KEY FROM CONFIG.JSON" "http://localhost:3000/api/admin/cron"' > /dashboardsy-cron.sh` as root and then run `chmod +x /dashboardsy-cron.sh` also as root.   
Then run `EDITOR=nano crontab -e` and paste the following line over there:
```cron
*/5 * * * * /dashboardsy-cron.sh
```

## Updating
Updating dashboardsy is simple, just cd to the directory where you cloned it, run   
```sh
scripts/update.sh
```   
That's it!
## File Structure
```
.
├── components
│   ├── Card.js
│   ├── Layout.js
│   └── Table.js
├── lib
│   ├── routes
│   │   ├── userCoinsUpdate.js
│   │   ├── userInfo.js
│   │   └── userResourcesUpdate.js
│   ├── cache.js
│   └── useIsTouchDevice.js
├── pages
│   ├── api
│   │   ├── admin
│   │   │   ├── user
│   │   │   │   └── [userid].js
│   │   │   ├── cron.js
│   │   │   └── _middleware.js
│   │   ├── auth
│   │   │   └── [...nextauth].js
│   │   └── user
│   │       ├── createServer.js
│   │       ├── deleteServer.js
│   │       ├── editServer.js
│   │       ├── fixUser.js
│   │       ├── regenPass.js
│   │       └── shop.js
│   ├── _app.js
│   ├── index.js
│   └── _middleware.js
├── public
│   └── favicon.png
├── scripts
│   └── update.sh
├── config.json
├── db.js
├── LICENSE
├── next.config.js
├── package.json
├── README.md
├── theme.js
└── webhook.js

11 directories, 31 files
```

## Disclaimer
```
THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.
```   
Also note that in no way, shape or form is dashboardsy endorsed, owned, or otherwise affiliated with Pterodactyl®.
