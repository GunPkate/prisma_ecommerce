const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req,res) => res.send('hello') )
// app.post('/:name',(req,res) => res.send('hello '+req.params.name) )
app.post('/',(req,res) => res.send(req.body) )

const prisma = new PrismaClient();

app.get('/booklist/', async (req,res)=>{
    const data = await prisma.book.findMany();
    res.send({data: data});
})

app.post('/booklist/', async (req,res)=>{
    const data = req.body;
    const result = await prisma.book.create({data: data});
    res.send( {result: result});
})

app.listen(3000);