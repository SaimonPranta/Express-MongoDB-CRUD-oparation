const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const uri = "mongodb+srv://organic_product:jx21oSHP7y0wYtKy@cluster0.1gt22.mongodb.net/organic_products?retryWrites=true&w=majority";

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("organic_products").collection("products")

    app.get('/getProducts', (req, res) => {
        collection.find({})
            .toArray((err, docu) => {
                res.send(docu)
            })
    })

    app.post('/addProduct', (req, res) => {
        collection.insertOne(req.body)
            .then(resu => {
                res.redirect("/")
            })
    })
    app.delete('/delete/:id', (req, res) => {
        const id = req.params.id
        collection.deleteOne({ _id: ObjectId(id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })

    })
    app.get('/details/:id', (req, res) => {
        const id = req.params.id
        collection.find({ _id: ObjectId(id) })
            .toArray((err, data) => {
                res.send(data[0])
            })
    })
    app.patch('/update', (req, res) => {
        collection.updateOne(
            { _id: ObjectId(req.body._id) },
            {
                $set: { "price": req.body.price, "quantity": req.body.quantity },
                $currentDate: { lastModified: true }
            }
        )
            .then(data => {
                res.send(data.modifiedCount > 0)
            })
    })

});


app.listen('3000', () => {
    console.log('listening to port 3000')
})