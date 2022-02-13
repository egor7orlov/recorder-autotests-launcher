const express = require('express');
const app = express();
const { autotestsRouter } = require('./routers');

app.use(express.json());
app.use('/autotests', autotestsRouter);
app.listen(process.env.PORT || 5000);
