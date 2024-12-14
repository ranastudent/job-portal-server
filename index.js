const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors())
app.use(express.json())

// DB_user: job_hunter
// DB_Password : Tb810eUkiQn5I5Zp



const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Password}@cluster0.kt8jb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

async function run() {
      try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");


            // jobs related api
            const jobsCollection = client.db('job-Portal').collection('jobs')
            const jobsApplicationCollection = client.db('job-Portal').collection('job_application')

            app.get('/jobs', async (req, res) => {
                  const cursor = jobsCollection.find();
                  const result = await cursor.toArray()
                  res.send(result)
            });
            app.get('/jobs/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) }
                  const result = await jobsCollection.findOne(query)
                  res.send(result)
            })

            // job application apis

            app.get('/jobs-application', async (req, res)=>{
                  const email = req.query.email;
            const query = { applicant_email: email }
            const result = await jobsApplicationCollection.find(query).toArray();
            res.send(result)
            })
            app.post('/jobs-application', async(req, res)=>{
                  const application = req.body
                  const result = await jobsApplicationCollection.insertOne(application)
                  res.send(result)
                })



      } finally {
            // Ensures that the client will close when you finish/error
            //     await client.close();
      }
}
run().catch(console.dir);


app.get('/', (req, res) => {
      res.send('job is falling from the sky')
})


app.listen(port, () => {
      console.log(`job is waiting : ${port}`)
})