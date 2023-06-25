const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const mongoURI = 'mongodb+srv://music-admin:music-admin-password@music.gf1zw4l.mongodb.net/MusicDB';

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB...');
    const db = client.db('MusicDB');

    // Fetch all data
    app.get('/api/data', async (req, res) => {
      try {
        const data = await db.collection('music-instruments').find().toArray();
        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    });

    // Fetch data by ID
    app.get('/api/data/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id, 10);
        const data = await db.collection('music-instruments').findOne({ id: id });
        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    });

    // Delete data by ID
    app.delete('/api/data/:id', async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const result = await db.collection('music-instruments').deleteOne({ id });

        if (result.deletedCount === 1) {
          res.json({ message: 'Item deleted successfully' });
        } else {
          res.status(404).json({ message: 'Item not found' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    });

    // Delete all data
    app.delete('/api/data', async (req, res) => {
      try {
        await db.collection('music-instruments').deleteMany();
        res.send('All items deleted');
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    });


    // Add data to the database
    app.post('/api/add-data', async (req, res) => {
      try {
        const instrument = req.body;
        const result = await db.collection('music-instruments').insertOne(instrument);
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    });
  })
  .catch(err => console.error(err));

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
