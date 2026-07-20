import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from "cors"
dotenv.config();

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.route.js';
import repairRoute from "./routes/repair.route.js"
import orderRoute from "./routes/order.route.js"
import contactFormRoute from "./routes/contactForm.route.js"
import adminRouter from "./routes/admin.route.js";
import productRouter from "./routes/product.route.js";

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use("/repair",repairRoute);
app.use("/order",orderRoute);
app.use("/contactForm",contactFormRoute);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;