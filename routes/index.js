const routerChain = require("./routerChain");
const routerBlock = require("./routerBlock");
const routerAccount = require("./routerAccount");
const routerTx = require("./routerTx");

module.exports = app => {
	app.use("/chain", 	routerChain);
	app.use("/block", 	routerBlock);
	app.use("/account",	routerAccount);
	app.use("/tx", 		routerTx);
}
