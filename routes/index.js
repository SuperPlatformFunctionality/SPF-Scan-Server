const routerBlock = require("./routerBlock");
//const routerTxAssist = require("./routerTxAssist");

module.exports = app => {
	app.use("/block", routerBlock);
//	app.use("/tx/assist", routerTxAssist);
}
