const Publication = require("../models/publication");
const User = require("../models/user");
const Follow = require("../models/follow");

async function publish(input, ctx) {
    console.log(input);
    const { id } = ctx.user;
    const { secure_url, public_id } = input;

    try {
        const publication = new Publication({ idUser: id, secure_url, public_id, createAt: Date.now() })
        await publication.save();
    } catch (error) {
        console.log(error);
    }
    return null;
}

async function getPublication(username) {
    const user = await User.findOne({ username });
    if (!user) throw new Error("Usuario no encontrado.");

    const publications = await Publication.find().where({ idUser: user.id }).sort({ createAt: -1 });

    return publications;
}

async function getPublicationsFolloweds(ctx) {
    const followeds = await Follow.find({ idUser: ctx.user.id }).populate("follow");
    const followedsList = [];
    for await (const data of followeds) {
        followedsList.push(data.follow)
    }

    const publicationList = [];
    for await (const data of followedsList) {
        const publications = await Publication.find().where({
            idUser: data._id,
        }).sort({ createAt: -1 }).populate("idUser");
        publicationList.push(...publications)
    }
    const result = publicationList.sort((a, b) => {
        return new Date(b.createAt) - new Date(a.createAt);
    });
    return result;

}

module.exports = {
    publish, getPublication, getPublicationsFolloweds,
}