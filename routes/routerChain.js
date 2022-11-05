const express = require('express');
const UserCheckMiddleWare = require("../middlewares/UserCheckMiddleWare");
const chainController = require('../controller/ChainController');

const router = express.Router();
router.post('/summary',  chainController.queryChainSummary);
//router.post('/price',  blockController.queryBlockSummary);

module.exports = router
