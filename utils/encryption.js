import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const encrypt = (data) => {
    try {
        return bcrypt.hashSync(data, bcrypt.genSaltSync(10));
    } catch (error) {
        console.log(error.message);
        return null;
    }

}


const compare = (data, encryptedData) => {
    try {
        return bcrypt.compareSync(data, encryptedData);
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

const generateAccessToken = (id) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.log(error.message);
        return null;
    }
}


export default { encrypt, compare, generateAccessToken, verifyToken };