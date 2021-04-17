const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

function createToken(user, SECRET_KEY, expiresIn) {
    const { id, name, email, username } = user;
    const payload = {
        id, name, email, username
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Querys

async function getUser(id, username) {
    let user = null;
    if (id) user = await User.findById(id);
    if (username) user = await User.findOne({ username });
    if (!user) throw new Error("El usuario no existe")
    return user;
}



// Mutations
async function register(input) {
    const newUser = input;
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();
    const { email, username, password } = newUser;

    // Revisamos si el mail esta en uso
    const foundEmail = await User.findOne({ email });
    if (foundEmail) throw new Error("El email esta en uso");

    // Revisamos si el username esta en uso
    const foundUsername = await User.findOne({ username });
    if (foundUsername) throw new Error("El nombre de usuario esta en uso");

    // Encriptar
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password, salt)

    try {
        const user = new User(newUser);
        user.save()
        return user;
    } catch (error) {
        console.log(error);
    }
}

async function login(input) {
    const { email, password } = input;

    const userFound = await User.findOne({ email: email.toLowerCase() });
    if (!userFound) throw new Error("Error en el email o contraseña");

    const passwordSuccess = await bcryptjs.compare(password, userFound.password)
    if (!passwordSuccess) throw new Error("Error en el email o contraseña");


    return {
        token: createToken(userFound, process.env.SECRET_KEY, "48h")
    }
}

async function updateAvatar(file) {
    console.log(file)
    return null;
}

async function updateImage(input, ctx) {
    const { id } = ctx.user;
    const { secure_url, public_id } = input;

    try {
        const user = await User.findById(id);
        const { avatar_id } = user;
        if (avatar_id) {
            await cloudinary.v2.uploader.destroy(avatar_id, (err) => {
                if (err) console.log(err);
            });
        }

        await User.findByIdAndUpdate(id, { "avatar": secure_url, "avatar_id": public_id })
    } catch (error) {
        console.log(error);
    }
}

async function deleteAvatar(ctx) {
    const { id } = ctx.user;
    try {
        const user = await User.findById(id);
        const { avatar_id } = user;

        await cloudinary.v2.uploader.destroy(avatar_id, (err) => {
            if (err) console.log(err);
        });

        await User.findByIdAndUpdate(id, { "avatar": "", "avatar_id": "" })
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function updateUser(input, ctx) {
    const { id } = ctx.user;
    try {

        if (input.currentPassword && input.newPassword) {
            //Cambiar password
            const userFound = await User.findById(id);

            const passwordSuccess = await bcryptjs.compare(
                input.currentPassword,
                userFound.password
            );

            if (!passwordSuccess) throw new Error("Contraseña incorrecta");

            const salt = await bcryptjs.genSaltSync(10);
            const newPasswordCrypt = await bcryptjs.hash(input.newPassword, salt);
            await User.findByIdAndUpdate(id, { password: newPasswordCrypt });

        } else {
            await User.findByIdAndUpdate(id, input)
        }
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}

async function search(search) {
    const users = await User.find({
        name: { $regex: search, $options: "i" },
    }).limit(20);
    return users;
}



module.exports = {
    register,
    getUser,
    login,
    updateAvatar,
    updateImage,
    deleteAvatar,
    updateUser,
    search,

};