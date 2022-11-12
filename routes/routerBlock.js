const express = require('express');
const UserCheckMiddleWare = require("../middlewares/UserCheckMiddleWare");
const blockController = require('../controller/BlockController.js');

const router = express.Router();
router.post('/summary',  blockController.queryBlockSummary);
router.post('/summaries',  blockController.queryBlockSummaries);

module.exports = router
