Router.route('/roles', function () {
        console.info("routing", "/roles");
        if(Roles.userIsInRole(Meteor.userId(),"role"))
            this.render('RolesList', {to: 'mainContent'});
        else
            throw new Meteor.Error(403,"User needs 'admin' roles to edit roles");
    },
    {name: 'role.list'}
);