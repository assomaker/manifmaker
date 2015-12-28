Template.assignmentMenu.events({
    "click #userToTask": function (event) {
        TaskFilter.set(noneFilter);
        UserFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.USERTOTASK);
    },
    "click #taskToUser": function (event) {
        UserFilter.set(noneFilter);
        TaskFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.TASKTOUSER);
    },
    "click #all": function (event) {
        TaskFilter.set(defaultFilter);
        UserFilter.set(defaultFilter);
        CurrentAssignmentType.set(AssignmentType.ALL);
    },
    "click #quarterHour": function (event) {
        var accuracy = CalendarAccuracyEnum["0.25"];
        Meteor.call("setCalendarAccuracy",accuracy);
    },
    "click #halfHour": function (event) {
        var accuracy = CalendarAccuracyEnum["0.5"];
        Meteor.call("setCalendarAccuracy",accuracy);
    },
    "click #oneHour": function (event) {
        var accuracy = CalendarAccuracyEnum["1"];
        Meteor.call("setCalendarAccuracy",accuracy);
    },
    "click #twoHour": function (event) {
        var accuracy = CalendarAccuracyEnum["2"];
        Meteor.call("setCalendarAccuracy",accuracy);
    },
    "click #fourHour": function (event) {
        var accuracy = CalendarAccuracyEnum["4"];
        Meteor.call("setCalendarAccuracy",accuracy);
    },
    "click #populate": function(event){
        Meteor.call("populate");
    }
});

Template.assignmentMenu.helpers({
    isSelected: function(mode){
        if(mode === CurrentAssignmentType.get()){
            return "active";
        }
        return "";
    },
    breadCrumbAssignment: function () {
        return [{label:"TODO fix breadcrumb",url:""}];
        var userFilter = UserFilter.get(),
            taskFilter = TaskFilter.get(),
            currentAssignmentType = CurrentAssignmentType.get(),
            selectedUser = SelectedUser.get(),
            selectedTask = SelectedTask.get(),
            selectedDate = SelectedDate.get(),
            selectedTimeSlot = SelectedTimeSlot.get(),
            result = [];

        if (currentAssignmentType === AssignmentType.USERTOTASK) {
            if (selectedUser === null) {
                result.push({
                    label: "Select a user",
                    url: ""
                });
            } else  {
                var userName = Users.findOne(selectedUser._id).name;
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
            }
            return result;
        }

        if (currentAssignmentType === AssignmentType.TASKTOUSER) {
            if (selectedTask === null) {
                result.push({
                    label: "Select a task",
                    url: ""
                });
            } else  {
                var taskName = Tasks.findOne(selectedTask._id).name;
                result.push({
                    label: taskName,
                    url: "/assignment/taskToUser/" + selectedTask._id
                });

                if (selectedTimeSlot === null) {//TODO pas top
                    result.push({
                        label: "Select one of the time slot [and a people need]",
                        url: ""
                    });
                } else {

                    var task = Tasks.findOne(selectedTask);
                    var timeSlot = TimeSlotService.getTimeSlot(task,selectedTimeSlot._id);


                    result.push({
                        label: new moment(timeSlot.start).format("HH:mm") + " to " +  new moment(timeSlot.end).format("HH:mm"),
                        url: "/assignment/taskToUser/" + selectedTask._id + "/" + selectedTimeSlot._id
                    });

                    if(true){ //if pas de task/people need selected
                        result.push({
                            label: "Select one of the available user",
                            url: ""
                        });
                    }
                }
            }
            return result;
        }

        if(currentAssignmentType == AssignmentType.ALL){
            result.push({
                label: "Welcome, start by selecting an assignment mode",
                url: ""
            });
            return result;
        }

    }
});