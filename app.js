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

import notificationRouter from "./routes/notification.route.js";

const app = express();
app.disable('x-powered-by');

// view engine setup
app.set('view engine', 'ejs');
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
}))
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

app.use('/api/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use("/api/repair",repairRoute);
app.use("/api/order",orderRoute);
app.use("/api/contactForm",contactFormRoute);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/notifications", notificationRouter);


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