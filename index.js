const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// server listening port
const port = 5000;

// mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pn1pz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
client.connect((err) => {
	const serviceCollection = client.db('delighted-pics').collection('services');
	const orderCollection = client.db('delighted-pics').collection('orders');

	// add all services in mongoDB
	app.post('/addServices', async (req, res) => {
		try {
			const data = await req.body;
			const result = await serviceCollection.insertMany(data);
			res.send('Successfully added');
		} catch (error) {
			console.log('err', error);
		}
	});

	// add single order in mongoDB
	app.post('/order', async (req, res) => {
		try {
			const order = await req.body;
			const result = await orderCollection.insertOne(order);
			res.send(result.acknowledged);
		} catch (error) {
			console.log('err', error);
		}
	});

	// load all services from mongoDB
	app.get('/loadServices', async (req, res) => {
		try {
			const allServicesArray = await serviceCollection.find().toArray();
			if (allServicesArray.length > 0) {
				res.send(allServicesArray);
			}
		} catch (error) {
			console.log('err', error);
		}
	});

	// load single service from mongoDB
	app.get('/loadService/:id', async (req, res) => {
		try {
			const service = await serviceCollection
				.find({ _id: ObjectId(req.params.id) })
				.toArray();
			if (service.length > 0) {
				res.send(service[0]);
			}
		} catch (error) {
			console.log('err', error);
		}
	});
});

// root url route
app.get('/', (req, res) => {
	res.send('Hello delighted pics');
});

app.listen(port, () => {
	console.log(`The app listening at http://localhost:${port}`);
});
