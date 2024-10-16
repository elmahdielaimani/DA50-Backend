var userModel = require('./userModel');
var key = '123456789trytryrtry';
var encryptor = require('simple-encryptor')(key);

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
            // Utilisation de `await` avec `findOne()` pour récupérer l'utilisateur
            const result = await userModel.findOne({ email: userDetails.email });

            // Vérification si un utilisateur a été trouvé et si le mot de passe est correct
            if (result) {
                var decrypted = encryptor.decrypt(result.password);
                if (decrypted === userDetails.password) {
                    resolve({ status: true, msg: "User validated successfully" });
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
  