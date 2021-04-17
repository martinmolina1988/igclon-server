const { gql } = require("apollo-server");

const typeDefs = gql`


# =====================
#       Types
# =====================

type User{
    id: ID
    name: String
    username: String
    email: String
    siteWeb: String
    description: String
    password: String
    avatar: String
    createAt: String
    avatar_id: String
}


type Image{
    id: ID
    public_id: String!
    secure_url: String!
}

type Token{
    token: String
}

type UpdateAvatar{
    status: Boolean
    urlAvatar: String
}

type Publish{
    id: ID
    idUser:ID
    public_id: String!
    secure_url: String!
    createAt: String
}

type Comment{
    idPublication: ID,
    idUser: User,
    comment: String,
    createAt: String
}


type FeedPublication{
    id: ID,
    idUser: User,
    secure_url:String,
    createAt: String,
}

# =====================
#       Inputs
# =====================

input UserInput{
    name: String!
    username: String!
    email: String!
    password: String!

}
input ImageInput{
    public_id: String!
    secure_url: String!

} 
input PublishInput{
    public_id: String!
    secure_url: String!

}

input LoginInput{
    email: String!
    password: String!
}

input UserUpdateInput{
    name: String
    email: String
    currentPassword: String
    newPassword: String
    siteWeb: String
    description: String
}


input CommentInput{
    idPublication: ID,
    comment: String
}

# =====================
#       Querys
# =====================

type Query{
    # User
    getUser(id: ID,  username: String ): User
    search(search: String): [User]

    # Follow
    isFollow(username: String!): Boolean
    getFollowers(username: String!): [User]
    getFolloweds(username: String!): [User]
    getNotFolloweds: [User]

    # Publication
    getPublication(username: String!): [Publish]
    getPublicationsFolloweds: [FeedPublication]
    
    # Comment
    getComments(idPublication: ID!): [Comment]

    # Like
    isLike(idPublication: ID!): Boolean
    countLike(idPublication: ID!): Int
}







# =====================
#       Mutations
# =====================

type Mutation{
# User
register(input: UserInput): User
login(input: LoginInput): Token
updateAvatar(file: Upload): UpdateAvatar
updateImage(input: ImageInput): Image
deleteAvatar: Boolean
updateUser(input: UserUpdateInput): Boolean


# Follow
follow(username: String!): Boolean
unFollow(username: String!): Boolean

# Publication
publish(input: ImageInput): Publish

# Comment
addComment(input: CommentInput): Comment


# Like
addLike(idPublication: ID!): Boolean
deleteLike(idPublication: ID!): Boolean

}   
`;

module.exports = typeDefs;