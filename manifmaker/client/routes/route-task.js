Router.route('/tasks', function () {
        console.info("routing", "/tasks");
        this.render('TasksList', {to: 'mainContent'});
    },
    {name: 'task.list'}
);

Router.route('/task', function () {
        console.info("routing", "/task");
        this.render('task', {to: 'mainContent'});
    },
    {name: 'task.create'}
);

Router.route('/task/:_id', function () {
        console.info("routing", "/task/"+this.params._id);
        this.render('task', {
            data: function () {
                var currentTask = this.params._id;
                return Tasks.findOne({_id: currentTask});
            }
        }, {to: 'mainContent'});
    },
    {name: 'task.read'}
);

Router.route('/task/:_id/delete', function () {
        console.info("routing", "/task/"+this.params._id+"/delete");
        this.render('tasksList', {
            data: function () {
                var currentTask = this.params._id;
                return Tasks.remove({_id: currentTask});
            }
        }, {to: 'mainContent'});
    },
    {name: 'task.delete'}
);
