const express = require('express');
require('express-async-errors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const db = require('./src/config/db')
const path = require('path');
const app = express();
app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
// Connect to DB server
db.connect()

// dotenv
dotenv.config();

const __name = path.resolve();
app.use('/uploads', express.static(path.join(__name, '/uploads')))

const router = require('./src/routes')




app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

router(app)

const port = process.env.PORT

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
