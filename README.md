# Chatpot-Auth-Server
authentication server application for Chatpot service.

## How to run
run & test commands are same as followings.
```
$ npm install
$ npm run dev
```
to run a test via jest,
```
$ npm run test
```

## Run with Configuration
this application needs configuration file. you can run with custom path of the configuration file.
```
CONFIG_FILE=/home/jaydee/test-conf.json ts-node src/app.ts
```
format of the configuration file must be JSON.
```
{
	"HTTP_PORT": 3000,
	"MYSQL_HOST": "YOUR_MYSQL_HOST",
	"MYSQL_PORT": 3306,
	"MYSQL_USER": "root",
	"MYSQL_DATABASE": "YOUR_MYSQL_DB_NAME",
	"MYSQL_PASSWORD": "YOUR_MYSQL_PASSWORD"
}
```
or you can supply values through environment variables.
```
HTTP_PORT=8080 MYSQL_HOST=127.0.0.1 ts-node src/app.ts
```

## So.. what is this?
comming soon.