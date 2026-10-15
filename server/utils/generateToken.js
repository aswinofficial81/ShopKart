const jwt = require("jsonwebtoken");

const generateToken = (customerId) => {
    return jwt.sign(
        { id: customerId },
        process.env.JWT_SECRET,
        {
            expiresIn: "10d"
        }
    );
};

module.exports = generateToken;