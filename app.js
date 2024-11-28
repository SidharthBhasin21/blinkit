const express = require('express');
const app  = express();
const indexRouter = require('./routes/index')
require('dotenv').config()

app.use('/',indexRouter)



app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
})
