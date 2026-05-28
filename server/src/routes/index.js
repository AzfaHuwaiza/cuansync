const router = require('express').Router();
const umkmRouter = require('./umkm');
const authRouter = require('./auth');
const transactionRouter = require('./transaction');
const productRouter = require('./product');
const profileRouter = require('./profile');
const routerAi = require('./ai');


router.use('/profile', profileRouter);
router.use('/umkm', umkmRouter);
router.use('/auth', authRouter);
router.use('/transaction', transactionRouter);
router.use('/product', productRouter);
router.use('/chatKonsul', routerAi);


module.exports = router;