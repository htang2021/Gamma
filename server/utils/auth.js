const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysupersecret';
const expiration = '2h';

module.exports - {

    //funtion for our authenticated routes
    authMiddleware: function ({req}) {
        // allows token to be sent via req.query or headers
        let token = req.body.token || req.query.token || req.headers.authorization;
       
        if (req.headers.authorization) {
           token = token.split(' ').pop().trim();
       }

       if(!token) {
           return req;
       }

     // verfiy data and get uses out of it 
     try {
         const { data } = jwt.verify(token, secret, { maxAge: expiration });
         req.user = data;
     } catch  {
         console.log('Invalid token');
     }

     // return updated request object
     return req;
    },
    
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload}, secret, {expiresIn: expiration})
    },
};