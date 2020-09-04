const express = require('express');
const app = express();
const multer = require('multer');
const path = require("path");
var request = require('request');
var fs = require('fs');


const {WebClient} = require('@slack/web-api');

const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);

const conversationId = '#images-api';




// storage engine

const storage = multer.diskStorage({
    destination: './upload/image',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
})

app.use('/profile', express.static('upload/image'));
app.post("/upload", upload.single('profile'), (req, res)=>{
        try {
            (async () => {

                // const res = await web.chat.postMessage({channel: conversationId, text: 'Hello there'});
                // console.log('Message sent:', res.ts);

                const result = await web.files.upload({
                    // The token you used to initialize your app is stored in the `context` object
                    token: token,
                    channels: conversationId,
                    initial_comment: "Here\'s my file :smile:",
                    // Include your filename in a ReadStream here
                    file: fs.createReadStream('./upload/image/'+req.file.filename)
                  });
            })();
        }
          catch (error) {
            console.error(error);
          }
})


app.listen(4000,()=>{
    console.log("server up and running");
})