Router.route('/assignment/taskToUser', function () {
        TaskFilter.set(defaultFilter);
        UserFilter.set(noneFilter);
        CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
        SelectedUser.set(null);
        SelectedTask.set(null);

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.taskToUser'
    }
);

Router.route('/assignment/taskToUser/:taskId/:timeSlotId', function () {
        console.info("routing", '/assignment/taskToUser/' + this.params.taskId + '/' + this.params.timeSlotId);

        CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    SelectedTask.set({_id: this.params.taskId});
    SelectedTimeSlot.set({_id: this.params.timeSlotId});

        var task = Tasks.findOne({_id: this.params.taskId});
        var timeSlot = TimeSlotService.getTimeSlot(task, this.params.timeSlotId);


        var newFilter = {
            availabilities: {
                $elemMatch: {
                    start: {$lte: timeSlot.start},
                    end: {$gte: timeSlot.end}
                }
            }
        };

        UserFilter.set(newFilter);

    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.taskToUser.task.timeSlot'
    }
);

Router.route('/assignment/taskToUser/:taskId', function () {

        CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
        SelectedTask.set({_id: this.params.taskId});
        SelectedTimeSlot.set(null);
        UserFilter.set(noneFilter);


    }, {
        controller: 'AssignmentController',
        name: 'assignment.calendar.taskToUser.task'
    }
);

