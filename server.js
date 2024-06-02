const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const { error } = require('console');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const fileUpoload = require('express-fileupload')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpoload())

app.get('/',(req,res) => res.send('hello') )
// app.post('/:name',(req,res) => res.send('hello '+req.params.name) )
app.post('/',(req,res) => res.send(req.body) )

const prisma = new PrismaClient();

function checkSignIn(req, res, next){
    try {
        const secret = process.env.TOKEN_SECRET;
        const token = req.headers['authorization']
        const result = jwt.verify( token, secret);

        if(result != undefined){
            next();
        }
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
}

app.get('/user/info', checkSignIn, (req, res, next) => {
    try {
        res.send('  hello  ')
    } catch (e) {
        res.status(500).send({ error: e.message});
    }
} )

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
        res.status(500).send({ error: e.message })
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
        res.status(500).send({ error: e.message })
    }
})

app.post('/booklist/min', async (req,res) => {
    try {
        const data =await prisma.book.aggregate( { _min: { 
            price:  true
        } } )
        res.send({results: data})
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

app.post('/booklist/avg', async (req,res) => {
    try {
        const data =await prisma.book.aggregate( { _avg: { 
            price:  true
        } } )
        res.send({results: data})
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

app.get('/booklist/findYearMonthDay',async (req,res)=>{
    try{
        const data = await prisma.book.findMany({
            where: {
                registeredDate: new Date('2024-05-10')
            }
        })
        res.send({result:data})
    } catch (e){
        res.status(500).send({ error: e.message })
    }
})

app.get('/booklist/findYearMonth',async (req,res)=>{
    try{
        const data = await prisma.book.findMany({
            where: {
                registeredDate: { 
                    gte: new Date('2024-05-01'), 
                    lte: new Date('2024-05-31') 
                },
            }
        })
        res.send({result:data})
    } catch (e){
        res.status(500).send({ error: e.message })
    }
})

app.get('/user/createToekn', async (req,res) => {
    try {
        const secret = process.env.TOKEN_SECRET;
        const payload = {
            id: 100,
            name: 'GunP',
            level: 'admin'
        }
        const token = jwt.sign(payload, secret, {expiresIn: '1d'})
        res.send({token: token})
    } catch (e) {
        res.status(500).send({ error: e.message })    
    }
})

app.get('/user/verify', async (req,res) => {
    try {
        const secret = process.env.TOKEN_SECRET;
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJuYW1lIjoiR3VuUCIsImxldmVsIjoiYWRtaW4iLCJpYXQiOjE3MTY5ODk1MDQsImV4cCI6MTcxNzA3NTkwNH0.5BJYZDs0gFMFrqDfR6OpXCQwDJwaSZGGSN2tpbQr4MA'
        const result = jwt.verify(token,secret);

        res.send({ result: result })
    } catch (e) {
        res.status(500).send({ error: e.message })    
    }
})

app.get('/onetoone/', async (req,res) => {
    try {
        const data  = await prisma.orderDetail.findMany({
            include: {
                Book: true
            }
        })

        res.send({ result: data })
    } catch (e) {
        res.status(500).send({ error: e.message })    
    }
})

app.get('/onetomany/', async (req,res) => {
    try {
        const data = await prisma.book.findMany({
            include: {
                OrderDetail: true
            }
        })
        res.send({ result: data })
    } catch (e) {
        res.status(500).send({ error: e.message })    
    }

})

app.get('/multiModel/', async (req,res) => {
    try {
        const data = await prisma.customer.findMany({
            include: {
                Order: {
                    include: {
                        OrderDetail: true
                    }
                }
            }
        })
        res.send({ result: data })
    } catch (e) {
        res.status(500).send({ error: e.message })    
    }

})

app.post('/book/fileUpload/', (req,res) => {
    try {
        console.log(123)
        const myFile = req.files.myFile;
        console.log(myFile)
        myFile.mv('./uploads/' + myFile.name, (err) => {
            if(err){
                res.status(500).send({ error: err })
            }
            res.send({ message:"success" })
        })
    } catch (e) {
        res.status(500).send({ error: e.message })    
    }
})

app.get('/book/readFile/', ( req, res) => {
    try {
        const fs = require('fs');
        fs.readFile("./uploads/test.txt", (err,data)=>{
            if(err){
                throw err
            }

            res.send(data)
        })
    } catch (e) {
        res.status(500).send({ error: e.message })          
    }
})

app.get('/book/writeFile/', ( req, res) => {
    try {
        const fs = require('fs');
        fs.writeFile("./uploads/test.txt", 'hello GP', (err,data)=>{
            if(err){
                throw err
            }

            res.send({ message: "success"})
        })
    } catch (e) {
        res.status(500).send({ error: e.message })          
    }
})

app.get('/book/removeFile/', ( req, res) => {
    try {
        const fs = require('fs');
        fs.unlinkSync("test.txt" )
        res.send({ message: "success"})
    } catch (e) {
        res.status(500).send({ error: e.message })          
    }
})

app.get('/book/fileExist/', ( req, res) => {
    try {
        const fs = require('fs');
        const found = fs.existsSync('package.json')
        res.send({ found: found})
    } catch (e) {
        res.status(500).send({ error: e.message })          
    }
})

app.get('/createPDF/', (req, res)=>{
    try {
        const PDF = require('pdfkit');
        const fs = require('fs');
        const doc = new PDF();

        doc.pipe(fs.createWriteStream('output.pdf'))
        doc.font('kanit/Kanit-Medium.ttf').fontSize(25).text('สวัสดี ทดสอบ Some text embeded font!',100,100);
        doc.addPage().fontSize(25).text('Here is some vector graphics...',100,100)
        doc.end();

        res.send({ message: "success"})
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

app.listen(3000);