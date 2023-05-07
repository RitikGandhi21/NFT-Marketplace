const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mdb_config = require('./mdb_config.js');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

const url = 'mongodb+srv://grsingh:' + mdb_config.mdb_pass + '@clustermdb.a2hzca7.mongodb.net/?retryWrites=true&w=majority'

// Connect to MongoDB Atlas
mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
.then(() => {
	console.log("Connected to db");
})
.catch((err) => {
	console.log("Error connecting to db:");
	console.log(err)
});

const jsonSchema = new mongoose.Schema({
	data: {
	  type: Object,
	  required: true,
	},
});
  
const JsonModel = mongoose.model('Json', jsonSchema);

app.post('/json', async (req, res) => {
	const jsonData = new JsonModel({
		data: req.body,
	});
	const savedData = await jsonData.save();
	res.json({ id: savedData._id });
});

app.get('/json/:id', async (req, res) => {
	const jsonData = await JsonModel.findById(req.params.id);
	res.json(jsonData.data);
});

// Start the server
app.listen(8000, () => {
  	console.log('Server listening on port 8000');
});
