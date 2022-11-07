const routerChain = require("./routerChain");
const routerBlock = require("./routerBlock");
const routerTx = require("./routerTx");

module.exports = app => {
	app.use("/chain", routerChain);
	app.use("/block", routerBlock);
	app.use("/tx", routerTx);
}
