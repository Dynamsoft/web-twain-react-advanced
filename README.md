## Introduction

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It utilizes the SDK [Dynamic Web TWAIN](https://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx) to provide the following functionalities

* Scan documents from physical scanners
* Capture images from Webcams
* Read local documents (bmp/jpg/png/tif/pdf)
* View and process the documents already scanned/captured/read
    * Simple edits (rotate/flip/mirror/crop, etc.)
    * Save locally or upload to the server
    * Extract barcode or text

## What You Should Know
- [![](https://img.shields.io/badge/Download-Offline%20SDK-orange)](https://www.dynamsoft.com/web-twain/downloads)
- [![](https://img.shields.io/badge/Get-30--day%20FREE%20Trial%20License-blue)](https://www.dynamsoft.com/customer/license/trialLicense/?product=dwt)

## Available Scripts

In the project directory, you can run:

### `npm install` && `npm start`

Sets up and runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `cd server` && `npm install` && `node server.js`

Sets up and runs the server piece which is used solely for receiving uploaded files.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

