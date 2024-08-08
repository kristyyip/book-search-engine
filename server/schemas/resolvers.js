// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // get a single user by either their id or their username
        me: async (parent, args, context) => {

            if (context.user) {
                const user = await User.findById(context.user.id).populate('savedBooks');

                return user;
            }

            throw AuthenticationError;
        },
    },

    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },

        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        // {body} is destructured req.body
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            
            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        },

        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        saveBook: async (parent, { bookInfo }, context) => {
            if (context.user) {
                const book = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: 
                        { savedBooks: bookInfo } 
                    },
                    { new: true, runValidators: true }
                );

                return book;
            };

            throw AuthenticationError;
        },

        // remove a book from `savedBooks`
        async removeBook(parent, { bookId }, context) {
            if (context.user) {
                const book = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                return book;
            };

            throw AuthenticationError;
        },
    }
};

module.exports = resolvers;
