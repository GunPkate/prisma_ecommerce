const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const { error } = require('console');
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

app.put('/booklist/update/:id', async (req,res)=>{
    try {
        const result = await prisma.book.update( {
            data:{
                isbn:  "1000",
                name:  "Flutter 2",
                price: 700
            } ,
            where: {
                id: parseInt(req.params.id)
            }
        }) 
        res.send( {result: "success"});
    } catch (e) {
        res.status(500).send({error: e.message});
    }
})

app.delete('/booklist/remove/:id', async (req,res)=>{
    try {
        const result = await prisma.book.delete( {
            where: {
                id: parseInt(req.params.id)
            }
        }) 
        res.send( {result: "success"});
    } catch (e) {
        res.status(500).send({error: e.message});
    }
})

app.post('/booklist/search/', async (req,res)=>{
    try {
        const keyword = req.body.keyword
        const data = await prisma.book.findMany({
            where: {
                name: {
                    contains: keyword
                }
            }
        })
        res.send({ result: data})
    } catch (e) {
        res.sendStatus(500).send({error: e.message})
    }
})

app.post('/booklist/searchStart/', async (req,res)=>{
    try {
        const keyword = req.body.keyword
        const data = await prisma.book.findMany({
            where: {
                name: {
                    startsWith: keyword
                }
            }
        })
        res.send({ result: data})
    } catch (e) {
        res.sendStatus(500).send({error: e.message})
    }
})

app.post('/booklist/orderBy/', async (req,res)=>{
    try {
        const data = await prisma.book.findMany({
            orderBy: { price: 'desc' }
        })
        res.send({ result: data})
    } catch (e) {
        res.sendStatus(500).send({error: e.message})
    }
})

app.post('/booklist/greater/', async (req,res)=>{
    try {
        const data = await prisma.book.findMany({
            where: { price: { gt: 1300} }
        })
        res.send({ result: data})
    } catch (e) {
        res.sendStatus(500).send({error: e.message})
    }
})

app.post('/booklist/notnull/', async (req,res)=>{
    try {
        const data = await prisma.book.findMany({
            where: { detail: { not: null} }
        })
        res.send({ result: data})
    } catch (e) {
        res.sendStatus(500).send({error: e.message})
    }
})

app.post('/booklist/sum', async (req,res)=>{
    try {
        const data = await prisma.book.aggregate({_sum: { price: true }})
        res.send({ results: data})
    } catch (e) {
        res.status(500).send({ error: e})
    }

})

app.post('/booklist/between', async (req,res) => {
    try {
        const data =await prisma.book.findMany( { where: { 
            price: {
                gte : 900,
                lt: 1500
            }
        } } )
        res.send({results: data})
    } catch (e) {
        res.status(500).send({ error: e})
    }
})

app.post('/booklist/min', async (req,res) => {
    try {
        const data =await prisma.book.aggregate( { _min: { 
            price:  true
        } } )
        res.send({results: data})
    } catch (e) {
        res.status(500).send({ error: e})
    }
})

app.post('/booklist/avg', async (req,res) => {
    try {
        const data =await prisma.book.aggregate( { _avg: { 
            price:  true
        } } )
        res.send({results: data})
    } catch (e) {
        res.status(500).send({ error: e})
    }
})


app.listen(3000);