# Countries Example

This example is based on https://github.com/IBM/ibmi-oss-examples/tree/master/nodejs/express/customers replacing idb-pconnector by node-jt400.
The idb-pconnector can be used only on IBM i. That's why I replaced idb-pconnector by node-jt400.
It's only for testing purposes, no login/password form, no authentication, credentials in .env file.

## Purpose

The focus of this project is to create a RESTful application using [express](https://www.npmjs.com/package/express) and [node-jt400](https://www.npmjs.com/package/node-jt400).

This example includes a simple frontend using [pug](https://www.npmjs.com/package/pug) template engine.

## Getting Started

1. clone this project and change directory to the project

2. install dependencies

   `npm install`

3. execute the SQL script to create the file (don't forget to change the library name by your own library)
   on the IBM i

   `RUNSQLSTM SRCSTMF('/home/stormalf/country.sql') COMMIT(*NONE)`

4. create your .env file

   example of content

   HOST=YOUR_IBMi\
   USER=your_user\
   PASSWORD=your_password\
   LIBRARY=your_library

5. change the package.json

   replace by the correct path to the .env file or replace by your env file containing the correct values
   "start": "env-cmd -f ~/.env node app.js"

6. start the server

   `npm start`

7. access http://hostname:port/ (port is 8001 by default, or can be changed with the `PORT` environment variable)

## Examples :

![list of countries](https://github.com/stormalf/nodejs-ibmi-examples/blob/main/country_example/country.png)
