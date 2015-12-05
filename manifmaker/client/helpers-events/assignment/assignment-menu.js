Template.assignmentMenu.events({
    //"click #userToTask": function (event) {
    //    TaskFilter.set(noneFilter);
    //    UserFilter.set(defaultFilter);
    //    CurrentAssignmentType.set(AssignmentType.USERTOTASK);
    //},
    //"click #taskToUser": function (event) {
    //    UserFilter.set(noneFilter);
    //    TaskFilter.set(defaultFilter);
    //    CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    //},
    "click #all": function (event) {
        TaskFilter.set(defaultFilter);
        UserFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.ALL);
    },
    "click #quarterHour": function (event) {
        var accuracy = CalendarAccuracyEnum["0.25"];
        Meteor.call("setCalendarAccuracy", accuracy);
    },
    "click #halfHour": function (event) {
        var accuracy = CalendarAccuracyEnum["0.5"];
        Meteor.call("setCalendarAccuracy", accuracy);
    },
    "click #oneHour": function (event) {
        var accuracy = CalendarAccuracyEnum["1"];
        Meteor.call("setCalendarAccuracy", accuracy);
    },
    "click #twoHour": function (event) {
        var accuracy = CalendarAccuracyEnum["2"];
        Meteor.call("setCalendarAccuracy", accuracy);
    },
    "click #fourHour": function (event) {
        var accuracy = CalendarAccuracyEnum["4"];
        Meteor.call("setCalendarAccuracy", accuracy);
    }
});

Template.assignmentMenu.helpers({
    breadCrumbAssignment: function () {
        var userFilter = UserFilter.get(),
            taskFilter = TaskFilter.get(),
            currentAssignmentType = CurrentAssignmentType.get(),
            selectedUser = SelectedUser.get(),
            selectedTask = SelectedTask.get(),
            selectedDate = SelectedDate.get(),
            result = [];

        if (currentAssignmentType === AssignmentType.USERTOTASK) {
            if (selectedUser === null) {
                result.push({
                    label: "Select a user",
                    url: ""
                });
            } else  {
                var userName = UserRepository.findOne(selectedUser._id).name;
                result.push({
                    label: userName,
                    url: "/assignment/userToTask/" + selectedUser._id
                });

                if (selectedAvailability === null) {//TODO pas top
                    result.push({
                        label: "Select one of the availability",
                        url: ""
                    });
                } else {
                    result.push({
                        label: selectedDate.format("ddd D HH:mm"),
                        url: "/assignment/userToTask/" + selectedUser._id + "/" + selectedDate.format('x')
                    });

                    if(true){ //if pas de task/people need selected
                        result.push({
                            label: "Select one of the available task [and a people need]",
                            url: ""
                        });
                    }
                }



                //todo select a task [and a people need]

            }

            return result;
        }
        //if (currentAssignmentType === AssignmentType.TASKTOUSER) {
        //    if (selectedTask === null) {
        //        message += "Select a task";
        //    } else if (selectedTimeslotId === null) {//TODO pas top
        //        var taskName = TaskRepository.findOne(selectedTask._id).name;
        //        message += "Select one of " + taskName + " time slot";
        //    } else {
        //        message += "Select an availability of one of the available user";
        //    }
        //
        //    return message;
        //}
        //
        //return "Here are all the data";

    }
});