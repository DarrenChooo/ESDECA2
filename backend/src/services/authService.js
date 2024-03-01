config = require('../config/config');
const pool = require('../config/database')
module.exports.authenticate = (email) => {
    authenticateUserQuery = `SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
    FROM user INNER JOIN role ON user.role_id=role.role_id AND email='${email}'`
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Authentication Error')
                resolve(err)
            } else {
                connection.query(authenticateUserQuery, [email], (err, results) => {
                    if (err) {
                        console.log('Error on query on reading data from the file table', err)
                        reject(err)
                    } else {
                        if (results.length == 1) {
                            console.log('Authenticating user', results)
                            resolve(results)
                        }
                        else {
                            console.log('Login has failed', err)
                            reject(err)
                        }
                    }
                    connection.release()
                })
            }
        }) //End of getConnection
    })
} //End of authenticate     
