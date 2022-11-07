let fs = require("fs");
let path = require("path");
const process = require("process");
const Decimal = require("decimal.js");
const secp256k1 = require('secp256k1');
const base58 = require("./base58");
const {keccak256, sha256} = require('./ethersUtils');

let appendStrToFile = function(theStr, fileName) {
    fs.appendFile(path.join(__dirname, fileName), "\r\n" + theStr, function(err) {
        if(err) {
            console.error("writeStrToFile append str to file " + fileName + "error:", err);
        }
    });
}

//调用的时候应该使用await
let sleepForMillisecond = function(duration, isDisplayConsole) {
    isDisplayConsole = (isDisplayConsole == null) ? false : isDisplayConsole;
    if (isDisplayConsole) {
        console.log("sleep for ", duration , " millisecond")
    }
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, duration);
    });
};

let getRandomNumbericString = function(len) {
	let chars = '0123456789';
	let maxPos = chars.length;
	let code = '';
	for (let i = 0; i < len; i++) {
		code += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return code;
}

let getRandomString = function(len) {
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let maxPos = chars.length;
	let code = '';
	for (let i = 0; i < len; i++) {
		code += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return code;
}


let byteFormat = function(bytes) {
	return (bytes/1024/1024).toFixed(2)+'MB';
};
let displayCurMemoryUsage = function(preMsg) {
	let mem = process.memoryUsage();
	console.log(preMsg + "\n" +
				'rss:' + byteFormat(mem.rss) + "," +
				'heapTotal:' + byteFormat(mem.heapTotal) + "," +
				'heapUsed:' + byteFormat(mem.heapUsed) + "," +
				'external:' + byteFormat(mem.external) + "," +
				'arrayBuffers:' + byteFormat(mem.arrayBuffers));
}

let isInteger = function(str) {
	return Number.isInteger(str);
}

const calculationPrefix = "033cf5";
let transferAddressFromEthToSPF = function(ethAddress) {
	if(ethAddress.startsWith("0x")) {
		ethAddress = ethAddress.substring(2);
	}

	const addressHex = calculationPrefix + ethAddress;
	const addressBytes = Buffer.from(addressHex, "hex");

	//get checksum
	let checkSum = doSHA256(doSHA256(addressBytes));
	checkSum = checkSum.slice(0, 4);

	//将address和checksum组合，然后base58一下得到最终的地址
	let res = base58.encode58(Buffer.concat([addressBytes, checkSum]));
	return res;
}

let transferAddressFromSPFToETH = function(spfAddress) {
	let temp = base58.decode58(spfAddress);
	temp = Buffer.from(temp);

	let checkSum = temp.subarray(-4);
	let addressBytes = temp.subarray(0, temp.length - 4);
	if(!checkSum.equals(doSHA256(doSHA256(addressBytes)).slice(0, 4))) {
		return "" //checksum not right
	}

	let ethAddress = addressBytes.toString("hex");
	ethAddress = ethAddress.substring(calculationPrefix.length);
	ethAddress = "0x"+ethAddress;
	return ethAddress;
}


function doSHA256(msgBytes) {
	const msgHex = msgBytes.toString("hex");
	const hashHex = sha256('0x' + msgHex).replace(/^0x/, '')
	return Buffer.from(hashHex, "hex");
}

let MyUtils = {
	appendStrToFile,
	sleepForMillisecond,
	getRandomNumbericString,
	getRandomString,
	displayCurMemoryUsage,
	isInteger,
	transferAddressFromEthToSPF,
	transferAddressFromSPFToETH
}

module.exports = MyUtils;


