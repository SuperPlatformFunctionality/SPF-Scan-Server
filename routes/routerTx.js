const express = require('express');
const UserCheckMiddleWare = require("../middlewares/UserCheckMiddleWare");
const txController = require('../controller/TxController');

const router = express.Router();
router.post('/summary',  txController.queryTxSummary);
router.post('/history',  txController.queryTxHistory);
router.post('/count',  txController.queryTxCount);


module.exports = router
