import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const encrypt = (data) => {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(10));
}


const compare = (data, encryptedData) => {
    return bcrypt.compareSync(data, encryptedData);
}

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}


export default { encrypt, compare, generateAccessToken, verifyToken };