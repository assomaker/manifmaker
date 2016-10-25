import {SecurityServiceClient} from "../../client/service/SecurityServiceClient"
import {ManifMakerRouterController} from "./ManifMakerRouterController"

/**
 * @memberOf Route
 * @namespace Route.User
 */

/**
 * @memberOf Route.User
 * @summary Display the user list with filter and search
 * @locus client
 * @name 'user.list'  /users
 */
Router.route('/users', function () {
        //everyone can at least edit its own profile
        console.info("routing", "/users");
        this.render('usersList', {
            to: 'mainContent'
        });
    },
    {controller: ManifMakerRouterController,name: 'user.list'}
);

/**
 * @memberOf Route.User
 * @summary Display the create user form 
 * @locus client
 * @name 'user.create'  /user
 */
Router.route('/user', function () {
        SecurityServiceClient.grantAccessToPage( RolesEnum.USERWRITE);

        console.info("routing", "/user");

        if (this.ready()) {
            this.render('insertUserForm', {
                to: 'mainContent'
            });
        } else {
            console.log("Route /user : waiting team data"); //TODO add a spinner
        }

    },
    {controller: ManifMakerRouterController,name: 'user.create'}
);

/**
 * @memberOf Route.User
 * @summary Display the user update form by it's MongoId
 * @locus client
 * @param userId
 * @name 'user.read'  /user/:_id
 */
Router.route('/user/:_id', function () {
    if(!Users.findOne(this.params._id)){
        throw new Meteor.Error("404","User not found");
        return;
    }
        if(Users.findOne(this.params._id).loginUserId !== Meteor.userId())
            SecurityServiceClient.grantAccessToPage( RolesEnum.USERWRITE);

        console.info("routing", "/user/" + this.params._id);
        this.render('updateUserForm', {
            data: function () {
                var currentUser = this.params._id;
                return Users.findOne({_id: currentUser});
            }, to: 'mainContent'
        });
    },
    {controller: ManifMakerRouterController,name: 'user.write'}
);

/**
 * @memberOf Route.User
 * @summary Display the user in read mode by it's MongoId
 * @locus client
 * @param userId
 * @name 'user.read'  /user/:_id/read
 */
Router.route('/user/:_id/read', function () {
        if(!Users.findOne({_id: this.params._id})){
            throw new Meteor.Error("404","User not found");
        }
        if(Users.findOne(this.params._id).loginUserId !== Meteor.userId())
            SecurityServiceClient.grantAccessToPage( RolesEnum.USERREAD);

        console.info("routing", "/user/" + this.params._id);
        this.render('readUserForm', {
            data: function () {
                var currentUser = this.params._id;
                return Users.findOne({_id: currentUser});
            }, to: 'mainContent'
        });
    },
    {controller: ManifMakerRouterController,name: 'user.read'}
);

/**
 * @memberOf Route.User
 * @summary Display the user in read mode by it's MongoId
 * @locus client
 * @param userId
 * @name 'user.export'  /user/:_id/export
 */
Router.route('/user/:_id/export', function () {
        if(!Users.findOne({_id: this.params._id})){
            throw new Meteor.Error("404","User not found");
        }
        if(Users.findOne(this.params._id).loginUserId !== Meteor.userId())
            SecurityServiceClient.grantAccessToPage( RolesEnum.USERREAD);

        console.info("routing", "/user/" + this.params._id + "/export");
        this.render('exportUserAssignment', {
            data: function () {
                var currentUser = this.params._id;
                return Users.findOne({_id: currentUser});
            }, to: 'mainContent'
        });
    },
    {controller: ManifMakerRouterController,name: 'user.export'}
);


/**
 * @memberOf Route.User
 * @summary Logout usser
 * @locus client
 * @name 'logout'  /logout
 */
Router.route('/logout', function () {
        Accounts.logout();
        Router.go("/")
    },
    {controller: ManifMakerRouterController,name: 'logout'}
);









