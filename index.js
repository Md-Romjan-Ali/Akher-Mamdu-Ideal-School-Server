const { setServers } = require("node:dns");
setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const cors = require("cors")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, Collection, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const db = client.db("AMISchool");
        const studentCollection = db.collection('Students')
        app.post('/api/postallstudent', async (req, res) => {
            const corsur = req.body;
            const result = await studentCollection.insertOne(corsur)
            res.send(result)
        })
        app.get('/api/getstudent', async (req, res) => {
            const result = await studentCollection.find().toArray()
            res.send(result)
        })
        // student details
        app.get('/api/getstudent/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await studentCollection.findOne(query)
            res.send(result)
        })
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})