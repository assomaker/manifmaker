/**
 * @memberOf Route
 * @summary Display the task list with filter and search
 * @locus client
 * @name task.list  /tasks
 */
Router.route('/tasks', function () {
        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKREAD);
        console.info("routing", "/tasks");

        this.render('tasksList', {
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
        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKWRITE);
        console.info("routing", "/task");

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
        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKWRITE);
        console.info("routing", "/task/" + this.params._id);

        this.render('updateTaskForm', {
            data: function () {
                var currentTask = this.params._id;
                return Tasks.findOne({_id: currentTask});
            }, to: 'mainContent'
        });
    },
    {name: 'task.update'}
);


/**
 * @memberOf Route
 * @summary Display the task in read mode by it's MongoId
 * @locus client
 * @param taskId
 * @name task.read  /task/:_id
 */
Router.route('/task/:_id/read', function () {
        SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.TASKREAD);
        console.info("routing", "/task/" + this.params._id);

        this.render('readTaskForm', {
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
        var validationType = this.params.validationType;
        if (validationType === "time-slot")
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ASSIGNMENTVALIDATION, "time slot validation");
        if (validationType === "access-pass")
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.ACCESSPASSVALIDATION, "access pass validation");
        if (validationType === "equipment")
            SecurityServiceClient.grantAccessToPage(Meteor.userId(), RolesEnum.EQUIPEMENTVALIDATION, "equipment validation");
        console.info("routing", "/task/validation/" + this.params.validationType + "/" + this.params._id + "/" + this.params.state);

        var comment = $("#" + this.params.validationType + "-validation-new-comment").val();
        $("#" + this.params.validationType + "-validation-new-comment").val("");

        ValidationService.updateValidation(this.params._id, this.params.state, ValidationTypeUrl[this.params.validationType], comment);

        this.redirect("/task/" + this.params._id);

    },
    {name: 'task.validation.timeSlot'}
);










