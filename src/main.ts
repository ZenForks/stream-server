import express from "express";
import fs from "fs";
import { directory, port } from "./config.json";
import { resolve, join } from "path";

const app = express();
console.log(join(__dirname, "assets"))
app.use(express.static(join(__dirname, "assets")));
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.listen(port, () => {
   console.log(`Your app is listening on ${port}`);
});

const toTitle = (str: string): string => {
   const firstChar = str.split("")[0].toUpperCase();
   return firstChar + str.slice(1);
}
app.get("/", (req: any, res: any) => {
   return res.status(200).render("home.ejs", {
      udir: toTitle(directory)
   });
});

app.get("/:directory", (req: any, res: any) => {
   const udir = req.params.directory === "default" ? "" : req.params.directory ? req.params.directory : "";
   fs.readdir(resolve(__dirname, directory, udir), (err: any, files: string[]) => {
      if (err) {
         return res.status(404).send(JSON.parse(JSON.stringify({ "error": err })));
      }
      res.status(200).render("directory.ejs", {
         udir: toTitle(udir === "" ? directory : udir),
         files
      });
   });
});

app.get("/watch/:name", (req, res) => {
   if (!req.params.name) return res.sendStatus(404);
   const name = req.params.name;
   fs.createReadStream(`${resolve(__dirname, directory)}/${name}`)
       .pipe(res);
   res.status(200).send("<h1> OK </h1>");
});