const path = require('path');
const os = require('os');
const formidable = require('formidable');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

const uploadedFolderFullPath = path.join(__dirname, "uploaded");
const uploadTempFolder = path.join(os.tmpdir(), "web-twain-react-advanced-uploads");
fs.mkdirSync(uploadedFolderFullPath, { recursive: true });
fs.mkdirSync(uploadTempFolder, { recursive: true });

function isPathInside(directory, targetPath) {
    const relativePath = path.relative(directory, targetPath);
    return relativePath !== "" &&
        relativePath !== ".." &&
        !relativePath.startsWith(`..${path.sep}`) &&
        !path.isAbsolute(relativePath);
}

app.post('/upload', function (req, res) {
    const form = new formidable.IncomingForm({
        uploadDir: uploadTempFolder,
        maxFiles: 1
    });
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.error("Upload form parsing failed:", err);
            return res.status(400).send("Invalid upload.");
        }

        const remoteFiles = files && files.RemoteFile;
        const upload = Array.isArray(remoteFiles) ? remoteFiles[0] : remoteFiles;
        if (!upload || typeof upload.filepath !== "string") {
            return res.status(400).send("No RemoteFile was uploaded.");
        }

        const tempFilePath = path.resolve(upload.filepath);
        if (!isPathInside(uploadTempFolder, tempFilePath)) {
            return res.status(400).send("Invalid upload path.");
        }

        const originalFilename = typeof upload.originalFilename === "string"
            ? upload.originalFilename
            : "";
        const safeFilename = path.basename(originalFilename.replace(/\\/g, "/"))
            .replace(/[<>:"|?*\x00-\x1F]/g, "_")
            .trim();
        if (!safeFilename || safeFilename === "." || safeFilename === "..") {
            return res.status(400).send("Invalid filename.");
        }

        const destinationPath = path.resolve(uploadedFolderFullPath, safeFilename);
        if (!isPathInside(uploadedFolderFullPath, destinationPath)) {
            return res.status(400).send("Invalid filename.");
        }

        fs.copyFile(tempFilePath, destinationPath, function (copyError) {
            if (copyError) {
                console.error("Uploaded file could not be saved:", copyError);
                return res.status(500).send("Upload could not be saved.");
            }

            fs.unlink(tempFilePath, function (unlinkError) {
                if (unlinkError) {
                    console.error("Temporary upload file could not be removed:", unlinkError);
                }
                console.log("file saved");
                return res.status(200).end();
            });
        });
    });
});

var server = app.listen(2020, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listening at http://%s:%s', host, port);
})