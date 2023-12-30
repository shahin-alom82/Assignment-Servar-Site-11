const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: [
        'http://localhost:5173',
        "https://abcdremarkable-weather.surge.sh"
    ],
    credentials: true,
}));

console.log(process.env.DB_PASS)
// Mongodb Start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sozmemk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Mongodb Connect
        const serviceCollection = client.db('assignment11').collection('services');

        // jobCollection
        const jobCardCollection = client.db('jobCard').collection('card')

        // jobadd Collection
        const addCollection = client.db('jobAdd').collection('job');

        //My Bits
        const bitsCollection = client.db('mybits').collection('bit');

        /// Read
        app.get('/bit', async (req, res) => {
            const cursor = bitsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // Product Add
        app.post("/bit", async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await bitsCollection.insertOne(newProduct);
            console.log(result)
            res.send(result)
        })
        /////////////////////////////////////////////
        /// Read
        app.get('/job', async (req, res) => {

            const cursor = addCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // Product Add
        app.post("/job", async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await addCollection.insertOne(newProduct);
            console.log(result)
            res.send(result)
        })

        // Update
        app.get("/job/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addCollection.findOne(query);
            res.send(result);
        })

        // update
        app.put("/job/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCard = req.body;
            const Card = {
                $set: {
                    email: updatedCard.url,
                    job: updatedCard.job,
                    text: updatedCard.text,
                    selec: updatedCard.selec,
                    mini: updatedCard.mini,
                    max: updatedCard.max,
                }
            }
            const result = await addCollection.updateOne(filter, Card, options)
            res.send(result);
        })

        //Delete
        app.delete("/job/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addCollection.deleteOne(query);
            res.send(result);
        })

        //////////////////////////////////////////////
        // apply
        /// Read
        app.get('/card', async (req, res) => {
            const cursor = jobCardCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // job apply
        // get all products of specific brand
        app.get('/card/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brand: brand }
            const cursor = jobCardCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        //////////////////////////////////////////////

        // logOut
        app.post('/signup', async (req, res) => {
            const user = req.body;
            console.log('sign out', user)
            res.clearCookie('token', { maxAge: 0 }).send({ success: true })
        })

        // Data Setup Start
        app.get("/services", async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get("/card/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { description: 1, img: 1, deadline: 1, brand: 1, price: 1 },
            }
            const result = await jobCardCollection.findOne(query, options);
            res.send(result);
        })
        // Data Setup End

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);
// Mongodb End
app.get("/", (req, res) => {
    res.send('Online Marketing is Running');
})
app.listen(port, () => {
    console.log(`Online Marketing Running On Port ${port}`)
})