import cron from "node-cron"
import express from "express"
import Web3 from "web3"
import { Sequelize, DataTypes } from 'sequelize'
// const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org'));
// const latest = await web3.eth.getBlock('latest')
// console.log('latest', latest)
const sequelize = new Sequelize('block', 'root', 'wuxuehuai', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '+08:00'
});
const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: 'green'
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER
});
try {
  await sequelize.authenticate();

  (async () => {
    await sequelize.sync();
    // const jane = await User.create({ name: "Jane" });
    // console.log(jane.toJSON());
  })();
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
const router = express.Router();
let a = 1
cron.schedule('*/2 * * * * *', () => {
  a++
  // console.log('a', a);
});
/* GET home page. */
router.get('/', async (req, res, next) => {
  const allUser = await User.findAll({ raw: true })
  res.send(allUser);
});

export default router;
