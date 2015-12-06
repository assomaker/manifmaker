assignmentCalendarIsRendered = false;

AssignmentController = RouteController.extend({
    onBeforeAction: function () {
        if (!assignmentCalendarIsRendered) {
            this.render('AssignmentHome', {to: 'mainContent'});
            this.render("assignmentMenu", {to: "topNavBar"})
            assignmentCalendarIsRendered = true;
        }
        this.next();
    }
});


Router.route('/assignment', {
        controller: 'AssignmentController',
        name: 'assignment.calendar',
    }
);




Router.route('/assignment/user/:userId', function () {
        //ceci est seulement le userToTask => faire le taskToUser

        this.wait(Meteor.subscribe('users', this.params.userId));

        if (this.ready()) {
            //CurrentAssignmentType.set(AssignmentType.USERTOTASK);
            //SelectedUser.set({_id: this.params.userId});
            //TaskFilter.set(noneFilter);
            //
            //selectedAvailability = null; //TODO pas top
            //UserFilter.set(defaultFilter);
            ////TODO reduire la liste à ses amis

            Router.go("/assignment/userToTask/" + this.params.userId);
        } else {
            console.log("waiting user data"); //TODO add a spinner
        }

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.user'
    }
);


Router.route('/assignment/task/:taskId', function () {
        //ceci est seulement le taskToUser => faire le  userToTask

        this.wait(Meteor.subscribe('tasks', this.params.taskId));

        if (this.ready()) {
            //CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
            //SelectedTask.set({_id: this.params.taskId});
            //selectedTimeslotId = null;//TODO pas top
            //UserFilter.set(noneFilter);
            //TODO aouter du CSS pour signifier quelle tache est la current

            Router.go("/assignment/taskToUser/" + this.params.taskId);
        } else {
            console.log("waiting task data"); //TODO add a spinner
        }

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.task'
    }
);
