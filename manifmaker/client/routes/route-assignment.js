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

Router.route('/assignment/userToTask', function () {
        TaskFilter.set(noneFilter);
        UserFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.USERTOTASK);

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.userToTask'
    }
);

Router.route('/assignment/user/:userId', function () {
    //ceci est seulement le userToTask => faire le taskToUser

    // add the subscription handle to our waitlist
    this.wait(Meteor.subscribe('users', this.params.userId));

    // this.ready() is true if all items in the wait list are ready

    if (this.ready()) {
        CurrentAssignmentType.set(AssignmentType.USERTOTASK);
        SelectedUser.set({_id: this.params.userId});
        TaskFilter.set(noneFilter);


        selectedAvailability = null; //TODO pas top

        UserFilter.set(defaultFilter);
        //TODO reduire la liste à ses amis
    } else {
       console.log("waiting user data");
    }



    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.user'
    }
);


Router.route('/assignment/taskToUser', function () {
        UserFilter.set(noneFilter);
        TaskFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.taskToUser'
    }
);