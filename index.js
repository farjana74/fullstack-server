const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://productReview:qab4FUfPK7iplKPo@cluster0.2z78o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db('getReview')
        const reviewsCollection = database.collection('reviews');


        // post api---------
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            console.log(result)
            res.json(result)

        })

        // get api--------------
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray()
            res.send(reviews)

        })
        // delete review-----------
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.json(result);

        })
        // update review
        app.put("/statusUpdate/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const result = await reviewsCollection.updateOne(filter, {
                $set: {
                    status: req.body.status,
                },
            });
            res.send(result);
            console.log(result);
        });


    } finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running server');
})
app.listen(port, () => {
    console.log('running server or port server', port);
})