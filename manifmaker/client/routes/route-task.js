Router.route('/tasks', function () {
        this.render('tasksList', {to: 'mainContent'});
    },
    {name: 'task.list'}
);

Router.route('/task', function () {
        this.render('task', {to: 'mainContent'});
    },
    {name: 'task.create'}
);

Router.route('/task/:_id', function () {
        this.render('task', {
            data: function () {
                var currentTask = this.params._id;
                return Tasks.findOne({_id: currentTask});
            },to: 'mainContent'});
    },
    {name: 'task.read'}
);

Router.route('/task/:_id/delete', function () {
        this.render('tasksList', {
            data: function () {
                var currentTask = this.params._id;
                return Tasks.remove({_id: currentTask});
            },to: 'mainContent'});
    },
    {name: 'task.delete'}
);
