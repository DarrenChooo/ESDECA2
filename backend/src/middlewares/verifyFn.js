var jwt = require('jsonwebtoken');
var config = require('../config/config.js');

var secret = config.JWTKey

var verifyFn = {
    verifyToken: function (req, res, next) {
        var token = req.headers.authorization
        res.type('json');
        if (!token || !token.includes("Bearer ")) {
            res.status(403);
            res.send({Message:"Not Authorized"});
        } else {
            token = token.split('Bearer ')[1]; //obtain the token’s value
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {//invalid token
                    return res.status(403).send({message:"Not Authorized"})
                } else {
                    userID = req.headers['user'];
                    req.decodedID = decoded.id
                    if (userID === req.decodedID.toString()) {
                        next();
                    } else {
                        return res.status(403).send({message:"Not Authorized"})
                    }
                }
            });
        }
    },

    verifyAdmin: function (req, res, next) {
        var token = req.headers.authorization
        res.type('json');
        if (!token || !token.includes("Bearer ")) {
            res.status(403);
            res.send({Message:"Not Authorized"});
        } else {
            token = token.split('Bearer ')[1]; //obtain the token’s value
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {//invalid token
                    return res.status(403).send({message:"Not Authorized"})
                } else {
                    req.decodedRole = decoded.role
                    if (req.decodedRole == 'admin') {
                        next();
                    } else {
                        return res.status(403).send({message:"Not Authorized"})
                    }
                }
            });
        }
    }
}

module.exports = verifyFn;