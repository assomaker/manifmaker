/**
 * @memberOf Route
 * @summary Display the task list with filter and search
 * @locus client
 * @name task.list  /tasks
 */
Router.route('/tasks', function () {
        console.info("routing", "/tasks");
        this.render('tasksList', {
            //data: {
            //    tableSettings: function () {
            //        return {
            //            collection: Tasks,
            //            rowsPerPage: 10,
            //            showFilter: true,
            //            showRowCount: true,
            //            columnPerPage: 5,
            //            multiColumnSort: true,
            //            fields: [
            //                {key: 'name', label: 'Task name', fnAdjustColumnSizing: true},
            //
            //                {
            //                    key: 'teamId', label: 'Team', fnAdjustColumnSizing: true, fn: function (teamId, Task) {
            //                    return Teams.findOne(teamId).name;
            //                }
            //                },
            //                {
            //                    key: 'timeSlots', label: 'Time slots count', sortable: false, fn: function (timeSlots, Task) {
            //                    return timeSlots.length;
            //                }, fnAdjustColumnSizing: true
            //                },
            //                {label: 'Actions', tmpl: Template.taskButtons, fnAdjustColumnSizing: true}
            //
            //            ]
            //
            //        };
            //    }
            //},
            to: 'mainContent'
        });
    },
    {name: 'task.list'}
);

/**
 * @memberOf Route
 * @summary Display the create task form without time slots and validation workflow
 * @locus client
 * @name task.create  /task
 */
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

/**
 * @memberOf Route
 * @summary Display the task update form by it's MongoId
 * @locus client
 * @param taskId
 * @name task.read  /task/:_id
 */
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

/**
 * @memberOf Route
 * @summary Update validation state for one the task part
 * @locus client
 * @param validationType
 * @param taskId
 * @param validationState
 * @name task.validation.timeSlot  /task/validation/:validationType/:_id/:state
 */
Router.route('/task/validation/:validationType/:_id/:state', function () {
        console.info("routing", "/task/validation/"+this.params.validationType+"/" + this.params._id + "/" + this.params.state);

        var comment = $("#"+this.params.validationType+"-validation-new-comment").val();
        $("#"+this.params.validationType+"-validation-new-comment").val("");

        ValidationService.updateValidation(this.params._id,this.params.state, ValidationTypeUrl[this.params.validationType],comment);

        this.redirect("/task/"+this.params._id);

    },
    {name: 'task.validation.timeSlot'}
);










