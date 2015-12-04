Router.route('/tasks', function () {
        this.render('TasksList');
    },
    {name: 'task.list'}
);

Router.route('/team', function () {
        this.render('team');
    },
    {name: 'team.create'}
);

Router.route('/task/:_id', function () {
        this.render('task', {
            data: function () {
                var currentTask = this.params._id;
                return Tasks.findOne({_id: currentTask});
            }
        });
    },
    {name: 'task.read'}
);

Router.route('/task/:_id/delete', function () {
        this.render('tasksList', {
            data: function () {
                var currentTask = this.params._id;
                return Tasks.remove({_id: currentTask});
            }
        });
    },
    {name: 'task.delete'}
);
