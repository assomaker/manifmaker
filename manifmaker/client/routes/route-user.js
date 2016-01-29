/**
 * @memberOf Route
 * @summary Display the user list with filter and search
 * @locus client
 * @name user.list  /users
 */
Router.route('/users', function () {
        console.info("routing", "/users");
        this.render('usersList', {
            to: 'mainContent'
        });
    },
    {name: 'user.list'}
);

/**
 * @memberOf Route
 * @summary Display the create user form 
 * @locus client
 * @name user.create  /user
 */
Router.route('/user', function () {
        console.info("routing", "/user");

        this.wait(Meteor.subscribe('teams'));

        if (this.ready()) {
            this.render('insertUserForm', {
                to: 'mainContent'
            });
        } else {
            console.log("waiting team data"); //TODO add a spinner
        }

    },
    {name: 'user.create'}
);

/**
 * @memberOf Route
 * @summary Display the user update form by it's MongoId
 * @locus client
 * @param userId
 * @name user.read  /user/:_id
 */
Router.route('/user/:_id', function () {
        console.info("routing", "/user/" + this.params._id);
        this.render('updateUserForm', {
            data: function () {
                var currentUser = this.params._id;
                return Users.findOne({_id: currentUser});
            }, to: 'mainContent'
        });
    },
    {name: 'user.read'}
);









