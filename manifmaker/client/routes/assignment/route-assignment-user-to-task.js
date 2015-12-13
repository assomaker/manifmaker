Router.route('/assignment/userToTask', function () {
        console.info("routing", '/assignment/userToTask');

        TaskFilter.set(noneFilter);
        UserIndexFilter.set(noSearchFilter);
        $("#search_user_name").val("");
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
        var userId = SelectedUser.get()._id;
        var user = Users.findOne({_id: userId});
        var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);

        if (typeof availability === "undefined") {
            console.error("Template.assignmentCalendar.events.click .heure, .quart_heure", "User can't normally click on this kind of element when in userToTask");
            return;
        }

        SelectedDate.set(selectedDate);
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
        console.info("routing", '/assignment/userToTask/' + this.params.userId);

        CurrentAssignmentType.set(AssignmentType.USERTOTASK);
        SelectedUser.set({_id: this.params.userId});
        TaskFilter.set(noneFilter);

        selectedAvailability = null; //TODO pas top
        UserFilter.set(defaultFilter);
        //TODO reduire la liste à ses amis

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.userToTask.user'
    }
);