Router.route('/groups', function () {
        this.render('groupsList', {to: 'mainContent'});
    },
    {name: 'group.list'}
);

Router.route('/group', function () {
        this.render('group', {to: 'mainContent'});
    },
    {name: 'group.create'}
);

Router.route('/group/:_id', function () {
        this.render('group', {
            data: function () {
                var currentGroup = this.params._id;
                return Groups.findOne({_id: currentGroup});
            },to: 'mainContent'});
    },
    {name: 'group.read'}
);

Router.route('/group/:_id/delete', function () {
        this.render('groupsList', {
            data: function () {
                var currentGroup = this.params._id;
                return Groups.remove({_id: currentGroup});
            },to: 'mainContent'});
    },
    {name: 'group.delete'}
);
