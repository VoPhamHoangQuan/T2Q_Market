const express = require('express');
require('express-async-errors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const db = require('./src/config/db')

// Connect to DB server
db.connect()

// dotenv
dotenv.config();

const router = require('./src/routes')

const app = express();

app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

router(app)

const port = process.env.PORT

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
