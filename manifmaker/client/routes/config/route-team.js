Router.route('/teams', function () {
        this.render('teamsList');
    },
    {name: 'team.list'}
);

Router.route('/team', function () {
        this.render('team');
    },
    {name: 'team.create'}
);
Router.route('/team/:_id', function () {

        this.render('team', {
            data: function () {
                var currentTeam = this.params._id;
                return Teams.findOne({_id: currentTeam});
            }
        });
    },
    {name: 'team.read'}
);

Router.route('/team/:_id/delete', function () {
        this.render('teamsList', {
            data: function () {
                var currentTeam = this.params._id;
                return Teams.remove({_id: currentTeam});
            }
        });
    },
    {name: 'team.delete'}
);