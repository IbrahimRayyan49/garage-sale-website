import express from 'express';
import bodyparser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app=express();
const port=3000;

app.use(bodyparser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/admin",(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
})
app.post("/admin",(req,res)=>{
    const {username,password}=req.body;
    if (username === "Bero22" && password === "8980") {
        res.send(`<h1>Hello ${username}</h1>`);
    } else {
        res.redirect('/error.html');
    }
})
app.listen(port,()=>{
    console.log(`Currently functioning on port ${port}`);
    console.log(path.join(__dirname, 'public', 'admin.html'));
})

app.get("/",(req,res)=>{
    res.send("Hello Everybody");
})