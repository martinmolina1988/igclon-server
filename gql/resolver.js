const userController = require("../contollers/user");
const followController = require("../contollers/follow");
const publicationController = require("../contollers/publication");
const commentController = require("../contollers/comment");
const likeController = require("../contollers/like");

const resolvers = {
    Query: {
        // User
        getUser: (_, { id, username }) => userController.getUser(id, username),
        search: (_, { search }) => userController.search(search),

        // Follow
        isFollow: (_, { username }, ctx) => followController.isFollow(username, ctx),
        getFollowers: (_, { username }) => followController.getFollowers(username),
        getFolloweds: (_, { username }) => followController.getFolloweds(username),
        getNotFolloweds: (_, { }, ctx) => followController.getNotFolloweds(ctx),

        // Publication
        getPublication: (_, { username }) => publicationController.getPublication(username),
        getPublicationsFolloweds: (_, { }, ctx) => publicationController.getPublicationsFolloweds(ctx),

        // Comment
        getComments: (_, { idPublication }) => commentController.getComments(idPublication),

        // Like
        isLike: (_, { idPublication }, ctx) => likeController.isLike(idPublication, ctx),
        countLike: (_, { idPublication }) => likeController.countLike(idPublication),
    },
    Mutation: {
        // User
        register: async (_, { input }) => userController.register(input),
        login: (_, { input }) => userController.login(input),
        updateAvatar: (_, { file }) => userController.updateAvatar(file),
        updateImage: async (_, { input }, ctx) => userController.updateImage(input, ctx),
        deleteAvatar: (_, { }, ctx) => userController.deleteAvatar(ctx),
        updateUser: (_, { input }, ctx) => userController.updateUser(input, ctx),

        // Follow
        follow: (_, { username }, ctx) => followController.follow(username, ctx),
        unFollow: (_, { username }, ctx) => followController.unFollow(username, ctx),

        // Publication
        publish: (_, { input }, ctx) => publicationController.publish(input, ctx),

        // Comment
        addComment: (_, { input }, ctx) => commentController.addComment(input, ctx),

        // Like
        addLike: (_, { idPublication }, ctx) => likeController.addLike(idPublication, ctx),
        deleteLike: (_, { idPublication }, ctx) => likeController.deleteLike(idPublication, ctx),
    }
}
module.exports = resolvers;