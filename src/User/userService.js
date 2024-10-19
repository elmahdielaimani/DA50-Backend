var userModel = require('./userModel');
var key = '123456789trytryrtry';
var encryptor = require('simple-encryptor')(key);
const jwt = require('jsonwebtoken');
const secretKey = 'H76*dh@2#klJHE12%$32@f&!dsLpsak'; // Remplace par ta clé secrète pour le JWT

module.exports.createUserDBService = (userDetails) => {
    return new Promise(async function myFn(resolve, reject) {
        try {
            var userModelData = new userModel();

            userModelData.firstname = userDetails.firstname;
            userModelData.lastname = userDetails.lastname;
            userModelData.email = userDetails.email;

            // Encrypt the password
            var encrypted = encryptor.encrypt(userDetails.password);
            userModelData.password = encrypted;

            // Save the user data using async/await
            await userModelData.save();
            resolve(true);
        } catch (error) {
            console.error('Error saving user:', error);
            reject(false);
        }
    });
};


module.exports.loginUserDBService = (userDetails) => {
    return new Promise(async function myFn(resolve, reject) {
        try {
            const result = await userModel.findOne({ email: userDetails.email });

            if (result) {
                var decrypted = encryptor.decrypt(result.password);
                if (decrypted === userDetails.password) {
                    // Génération du token
                    const token = jwt.sign(
                        { userId: result._id, email: result.email },
                        secretKey,
                        { expiresIn: '1h' } // Le token expire dans 1 heure
                    );
                    
                    resolve({
                        status: true,
                        msg: "User validated successfully",
                        token: token // Retourne le token avec la réponse
                    });
                } else {
                    reject({ status: false, msg: "User validation failed" });
                }
            } else {
                reject({ status: false, msg: "User not found" });
            }
        } catch (error) {
            console.error('Error finding user:', error);
            reject({ status: false, msg: "Invalid data" });
        }
    });
};



  