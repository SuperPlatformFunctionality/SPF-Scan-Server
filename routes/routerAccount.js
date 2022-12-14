const express = require('express');
const UserCheckMiddleWare = require("../middlewares/UserCheckMiddleWare");
const accountController = require('../controller/AccountController');

const router = express.Router();
router.post('/summary',  accountController.queryAccountSummary);

module.exports = router
