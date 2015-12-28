Router.route('/tasks', function () {
        console.info("routing", "/tasks");
        this.render('tasksList', {
            data: {
                teams: Teams.find(),
                tableSettings: function () {
                    return {
                        collection: Tasks,
                        rowsPerPage: 10,
                        showFilter: true,
                        showRowCount: true,
                        columnPerPage: 5,
                        multiColumnSort: true,
                        fields: [
                            {key: 'name', label: 'Task name', fnAdjustColumnSizing: true},

                            {
                                key: 'teamId', label: 'Team', fnAdjustColumnSizing: true, fn: function (teamId, Task) {
                                return Teams.findOne(teamId).name;
                            }
                            },
                            {
                                key: 'timeSlots', label: 'Time slots count', sortable: false, fn: function (timeSlots, Task) {
                                return timeSlots.length;
                            }, fnAdjustColumnSizing: true
                            },
                            {label: 'Actions', tmpl: Template.taskButtons, fnAdjustColumnSizing: true}

                        ]

                    };
                }
            },
            to: 'mainContent'
        });
    },
    {name: 'task.list'}
);

Router.route('/task', function () {
        console.info("routing", "/task");

        this.wait(Meteor.subscribe('teams'));

        if (this.ready()) {
            this.render('insertTaskForm', {
                to: 'mainContent'
            });
        } else {
            console.log("waiting team data"); //TODO add a spinner
        }

    },
    {name: 'task.create'}
);

Router.route('/task/:_id', function () {
        console.info("routing", "/task/" + this.params._id);
        this.render('updateTaskForm', {
            data: function () {
                var currentTask = this.params._id;
                return Tasks.findOne({_id: currentTask});
            }, to: 'mainContent'
        });
    },
    {name: 'task.read'}
);

