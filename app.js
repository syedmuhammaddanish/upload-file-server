const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(
  fileUpload({
    // createParentPath: true,
  })
);
app.use(cors());

app.use('/static', express.static('public'))

const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


app.post("/upload", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  var fs = require('fs');
  const customerDID = req.body.name;
  const dateupload = req.body.datefolder;
  const file = req.files.myFile;
  var dict = { "plan": [1, 2, 3, 4, 5] };
  var dictstring = JSON.stringify(dict);
  //const blob = new Blob([dictstring], { type: 'application/json' });

  //const files = new File([ blob ], 'FileName.json');
  //console.log(dictstring);
  fs.writeFile("output.json", dictstring, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
  const path = __dirname + `/public/${customerDID}/${dateupload}/`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, {
      recursive: true
    });
  }
  const newpath = path + req.files.myFile.name;
  console.log(newpath);
  file.mv(newpath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send({ status: "success" });
  });
});

app.post("/delete", (req, res) => {
  var fs = require('fs');
  const customerDID = req.body.name2;
  const dateupload = req.body.datefolder2;
  const path = __dirname + `/public/${customerDID}/${dateupload}/`;
  try {
    fs.rmdirSync(path, { recursive: true });
    return res.send({ status: "success" });
  } catch (err) {
    return res.send({ status: "failed, try again" });
  }
});

app.get("/download/:DID/:date", function (req, res) {
  const customerDID = req.params.DID;
  const dateupload = req.params.date;
  const folderPath = __dirname + `/files/${customerDID}/${dateupload}/Plan.pdf`;
  console.log(customerDID);
  console.log(dateupload);
  console.log(folderPath);
  try {
    res.download(folderPath);
    return res.send({ status: "Downloaded successfully" });
  } catch (err) {
    return res.send({ status: "Download failed, try again" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})