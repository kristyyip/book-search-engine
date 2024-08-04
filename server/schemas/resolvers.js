// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // get a single user by either their id or their username
        getSingleUser: async ({ user = null, params }, res) => {
            const foundUser = await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });

            if (!foundUser) {
                return res.status(400).json({ message: 'Cannot find a user with this id!' });
            }

            res.json(foundUser);
        },
    },

    Mutation: {
        // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        createUser: async ({ body }, res) => {
            const user = await User.create(body);

            if (!user) {
                throw AuthenticationError;
            }

            const token = signToken(user);
            res.json({ token, user });
        },

        // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        // {body} is destructured req.body
        login: async ({ body }, res) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            
            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(body.password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);
            res.json({ token, user });
        },

        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        saveBook: async ({ user, body }, res) => {
            console.log(user);

            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                );

                return res.json(updatedUser);
            } catch (err) {
                console.log(err);
                throw AuthenticationError;
            }
        },

        // remove a book from `savedBooks`
        async deleteBook({ user, params }, res) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
            );

            if (!updatedUser) {
                throw AuthenticationError;
            }

            return res.json(updatedUser);
        },
    }
};

module.exports = resolvers;
