const routerChain = require("./routerChain");
const routerBlock = require("./routerBlock");

module.exports = app => {
	app.use("/chain", routerChain);
	app.use("/block", routerBlock);
}
