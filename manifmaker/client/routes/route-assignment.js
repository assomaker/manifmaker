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
        SelectedUser.set(null);

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.userToTask'
    }
);

Router.route('/assignment/userToTask/:userId/:selectedDate', function () {
        console.info("routing", '/assignment/userToTask/' + this.params.userId + '/' + this.params.selectedDate);

        var selectedDate = parseInt(this.params.selectedDate);

        //new moment(parseInt(selectedDate.format('x')))

        selectedDate = new moment(selectedDate);
        SelectedDate.set(selectedDate);
        var userId = SelectedUser.get()._id;
        var user = Users.findOne({_id: userId});
        var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);

        if (typeof availability === "undefined") {
            console.error("Template.assignmentCalendar.events.click .heure, .quart_heure", "User can't normally click on this kind of element when in userToTask");
            return;
        }
        selectedAvailability = availability;

        /*
         Task whose have at least one timeSlot (to begin, just one) as

         user.Dispocorrespante.start <= task.timeslot.start <= selectedDate and
         selectedDate <=  task.timeslot.end <=  user.Dispocorrespante.end

         */

        var newFilter = {
            timeSlots: {
                $elemMatch: {
                    start: {$gte: availability.start, $lte: selectedDate.toDate()},
                    end: {$gt: selectedDate.toDate(), $lte: availability.end}
                }
            }
        };

        TaskFilter.set(newFilter);

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.userToTask.user.date'
    }
);

Router.route('/assignment/userToTask/:userId', function () {
    TaskFilter.set(noneFilter);

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.userToTask.user'
    }
);


Router.route('/assignment/user/:userId', function () {
        //ceci est seulement le userToTask => faire le taskToUser

        this.wait(Meteor.subscribe('users', this.params.userId));

        if (this.ready()) {
            CurrentAssignmentType.set(AssignmentType.USERTOTASK);
            SelectedUser.set({_id: this.params.userId});
            TaskFilter.set(noneFilter);

            selectedAvailability = null; //TODO pas top
            UserFilter.set(defaultFilter);
            //TODO reduire la liste à ses amis

            Router.go("/assignment/userToTask/" + this.params.userId);
        } else {
            console.log("waiting user data"); //TODO add a spinner
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