const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// server listening port
const port = 5000;

// mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pn1pz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const collection = client.db('delighted-pics').collection('services');
	console.log('database connected');
});

app.get('/', (req, res) => {
	res.send('Hello delighted pics');
});

app.listen(port, () => {
	console.log(`The app listening at http://localhost:${port}`);
});
