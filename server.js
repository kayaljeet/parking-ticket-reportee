require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000; // Ensure this matches your frontend's expected port

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Load environment variables
const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db('complaints_db');
    const collection = db.collection('complaints');

    // API to get all challans with status 'pending' or 'sent'
    app.get('/locations', async (req, res) => {
      try {
        const challans = await collection.find({
            assigned_to: 'Joe',
            status: 'Active'
        }).toArray();

        res.json(challans);
      } catch (error) {
        console.error('Error fetching challans:', error);
        res.status(500).send('Error fetching challans');
      }
    });

    // API to get all challans with status 'Completed'
    app.get('/completed', async (req, res) => {
      try {
    const challans = await collection.find({
        $and: [
            {
                $or: [
                    { status: 'Completed' },
                    { status: 'Closed' }
                ]
            },
            {
                $or: [
                    { assigned_to: 'Joe' },
                    { last_reviewed_by: 'Joe' }
                ]
            }
        ]
    }).toArray();

        console.log(`Fetched ${challans.length} challans with status 'Completed' assigned to or reviewed by Joe`);
        res.json(challans);
      } catch (error) {
        console.error('Error fetching challans:', error);
        res.status(500).send('Error fetching challans');
      }
    });

    // API to get a single challan by ID
    app.get('/locations/:id', async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
      }
      try {
        const objectId = new ObjectId(id);
        const challan = await collection.findOne({ _id: objectId });
        if (!challan) {
          return res.status(404).send('Challan not found');
        }
        res.json(challan);
      } catch (err) {
        console.error('Error fetching challan:', err);
        res.status(500).send('Error fetching challan');
      }
    });

    // API to update challan details
    app.put('/locations/:id', async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body; // Extract updated data from the request body

      // Log incoming request details
      console.log('Updating challan with ID:', id);
      console.log('Updated data:', updatedData);

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
      }

      try {
        const objectId = new ObjectId(id);
        const existingChallan = await collection.findOne({ _id: objectId });

        if (!existingChallan) {
          console.error('Challan not found:', id);
          return res.status(404).send('Challan not found');
        }

        const result = await collection.findOneAndUpdate(
          { _id: objectId },
          { $set: updatedData },
          { returnDocument: 'after' }
        );

        // Log the entire result
        console.log('findOneAndUpdate result:', result);

        // Send the entire result as the response
        res.status(200).json(result); // Use json() to automatically stringify the response
      } catch (err) {
        console.error('Error updating challan:', err);
        res.status(500).send('Error updating challan');
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
