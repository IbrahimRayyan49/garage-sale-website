import express from 'express';
import bodyparser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const port=3000;

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'../public')));


app.post('/admin',(req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    console.log(`Username: ${username}, Password: ${password}`);
    if(username=="Bero22"&&password=="8980")
    {
        res.send(`<h1>Hello ${username}</h1>`);
    }
    else
    {
        res.redirect('/error.html');
    }

})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
app.get('/admin',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public','admin.html'));
}) ;