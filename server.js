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
    try {
        const data = req.body;
        const result = await prisma.book.create({data: data});
        res.send( {result: result});
    } catch (e) {
        res.status(500).send({error: e.message});
    }

})

app.post('/booklist/input', async (req,res)=>{
    try {
        const result = await prisma.book.create( {
            data:{
                isbn:  "1004",
                name:  "Flutter",
                price: 800
            } 
        }) 
        res.send( {result: result});
    } catch (e) {
        res.status(500).send({error: e.message});
    }

})

app.put('/booklist/update', async (req,res)=>{
    try {
        const result = await prisma.book.update( {
            data:{
                isbn:  "1000",
                name:  "Flutter 2",
                price: 900
            } ,
            where: {
                id: 3
            }
        }) 
        res.send( {result: result});
    } catch (e) {
        res.status(500).send({error: e.message});
    }

})

app.listen(3000);