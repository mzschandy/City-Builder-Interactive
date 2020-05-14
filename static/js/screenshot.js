import fileupload from "express-fileupload";
import express from "express";

const app = express();

app.use(fileupload());

app.post("/newlevelScreenshot", (req, res) => {
    const fileName = req.files.myFile.name;
    const path = __dirname + "/static/" + fileName;

    Image.mv(path, (error) => {
        if(error) {
            console.error(error);
            res.writeHead(500, {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify({status: "error", message: error}))
            return;
        }

        res.writeHead(200, {
            "Content-Type": "application/json"
        })
        res.end(JSON.stringify({status: "success", path: "/js/upload/" + fileName}))
    })
})
