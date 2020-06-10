const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

app.use('/', require('./routes/api/users'));
app.use('/', require('./routes/api/auth'));
app.use('/', require('./routes/api/posts'));
app.use('/', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));