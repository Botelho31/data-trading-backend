const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { errors } = require('celebrate');

const app = express();

// configurando express
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(morgan('short'));

// rotas

const userRoute = require('./routes/user-route');

app.use('/user', userRoute);

const imageRoute = require('./routes/image-route');

app.use('/image', imageRoute);

app.get('/', (req, res) => {
  res.send('One million pixels');
});

app.listen(8080);

// eslint-disable-next-line no-console
console.log('Listening on port 8080');

// Adiciona tratamento de erros
app.use(errors());

// catch all
app.use((error, req, res) => {
  res.status(error.status || 500);
  if (res.statusCode === 500) {
    res.json({ error: 'Server Error' });
  } else {
    res.json({ error: error.message });
  }
});

module.exports = app;
