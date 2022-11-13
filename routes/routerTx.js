const express = require('express');
const UserCheckMiddleWare = require("../middlewares/UserCheckMiddleWare");
const txController = require('../controller/TxController');

const router = express.Router();
router.post('/summary',  txController.queryTxSummary);
router.post('/list',  txController.queryTxList);
router.post('/count',  txController.queryTxCount);


module.exports = router
