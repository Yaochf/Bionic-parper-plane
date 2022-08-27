var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'sh-cdb-oy4op6p4.sql.tencentcdb.com',
  port     : '63999', 
  user     : 'root',
  password : 'y1234567',
  database : 'blog'
});
 
let query = function( sql, params ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, params, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( {err,rows} )
          }
          connection.release()
        })
      }
    })
  })
}




module.exports = { query }
