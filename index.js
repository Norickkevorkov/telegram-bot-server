const {startAdminBot} = require('./admin_bot');
const {startBot} = require('./bot');
const startApp = require('./app');

startApp();
startBot();
startAdminBot();
