const express = require('express'); 
const morgan = require('morgan');
const helmet = require('helmet');
const cors  = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const middlewares = require('./middleware');
const app = express();
const logs = require('./api/logs');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    orgin: process.env.CORS_ORIGIN,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World!',
    });
});

app.use('/api/logs', logs);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});