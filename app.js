const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const PORT = 8080;

const app = express();

// Configura los middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configura las rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configura el motor de plantillas Jade
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// Captura el error 404 y lo envía al siguiente middleware
app.use(function(req, res, next) {
  next(createError(404));
});

// Maneja los errores
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;
