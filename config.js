module.exports = {
 authorization: 'Client-ID 86ac1a737f1736a',
  // Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname, details set in .env
 uri : 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB
}