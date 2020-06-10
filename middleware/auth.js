const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (request, response, next) => {

    //GET TOKEN FROM HEADER
    const token = request.header('x-auth-token');

    //CHECK IF NO TOKEN
    if(!token) {
        return response.status(401).json({
            msg: 'No token. Authorization denied'
        })
    }

    //VERIFY TOKENS
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));
        request.user = decoded.user;
        next();
    } catch(error) {
        response.status(401).json({
            msg: 'Token is not valid'
        })
    }
    
}