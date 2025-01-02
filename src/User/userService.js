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
                        { userId: result._id, email: result.email, role: result.role },
                        secretKey,
                        { expiresIn: '1h' } // Le token expire dans 1 heure
                    );
                    
                    resolve({
                        status: true,
                        msg: "User validated successfully",
                        token: token, // Retourne le token avec la réponse
                        userId: result._id, // Retourne l'ID de l'utilisateur
                        role: result.role // Retourne le rôle de l'utilisateur
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



module.exports.updateUserRoleDBService = async (userDetails) => {
    try {
        const user = await userModel.findOneAndUpdate(
            { email: userDetails.email },  // Find the user by email
            { role: userDetails.role },     // Update the role
            { new: true }       // Return the updated document
        );

        if (!user) {
            return { status: false, message: 'User not found' };
        }
        return { status: true, message: 'User role updated successfully' };
    } catch (error) {
        console.error('Error updating user role:', error);
        throw new Error('Failed to update user role');
    }
};

module.exports.getUserFromDBService = async (id) => {
    try {
        const result = await userModel.findById(id);
        return result;
    } catch (error) {
        return false;
    }
};

module.exports.updateUserDBService = async (id, userDetails) => {
    try {
        // Si le mot de passe est fourni et non vide, on le chiffre
        if (userDetails.password && userDetails.password.trim() !== '') {
            userDetails.password = encryptor.encrypt(userDetails.password);
        } else {
            // Supprimez le champ password pour éviter de le mettre à jour
            delete userDetails.password;
        }

        // Mettre à jour les informations de l'utilisateur
        const result = await userModel.findByIdAndUpdate(id, userDetails, { new: true });
        return result;
    } catch (error) {
        console.error('Error updating user:', error);
        return false;
    }
};

module.exports.deleteUserDBService = async (email) => {
    try{
        console.log(email);
        const user = await userModel.deleteOne(
            {email: email}
        )
        return user;
    }
    catch (error) {
        console.error('Error deleting users:', error);
        throw new Error('Failed to delete user');
    }
}

module.exports.getAllUsersDBService = async () => {
    try {
        const users = await userModel.find({}); // Fetch all users from the database
        return users; // Return the fetched users (automatically wrapped in a Promise)
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users'); // Throw an error to be caught by the caller
    }
};

module.exports.getUserByEmailDBService = async (email) => {
    console.log(email)
    try {
        const user = await userModel.findOne({ email: email }); // Find a single user by email
        return user; // Return the found user (automatically wrapped in a Promise)
    } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user'); // Throw an error to be caught by the caller
    }
};