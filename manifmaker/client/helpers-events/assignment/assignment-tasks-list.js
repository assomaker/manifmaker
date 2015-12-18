Template.assignmentTasksList.helpers({
    tasks: function () {
        var filter = TaskFilter.get();
        return Tasks.find(filter);
    },
    team: function () {
        return Teams.findOne({_id:this.teamId}).name;
    },
    user: function () {
        return Users.findOne({_id:this.userId}).name;
    },

    timeSlots: function(){
        var task = this;
        var timeSlots = task.timeSlots;
        if(CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {
            var result = [];
            _.each(timeSlots, (timeSlot) => {
                var date = selectedDateUserToTask;
                var start = new moment(timeSlot.start);
                var end = new moment(timeSlot.end);
                if ((start.isBefore(date) || start.isSame(date)) &&
                    (end.isAfter(date) || end.isSame(date))) {
                    result.push(timeSlot);
                }
            });
            return result;
        } else {
            return timeSlots;
        }
    },

    peopleNeeded: function(){
        var peopleNeeded = this.peopleNeeded;

        if(CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {
            var result = [];

            _.each(peopleNeeded, (peopleNeed) => {
                var selectedUser = Users.findOne(SelectedUser.get());

                //userId : if existing, selected user must be the one
                if(peopleNeeded.userId){
                    if(peopleNeed.userId === selectedUser._id){
                        result.push(peopleNeed);
                        return;
                    }
                    return;
                }


                //teamId : if existing, selected user must at least have the required team
                if(peopleNeed.teamId){
                    if(!_.contains(selectedUser.teams,peopleNeed.teamId)){
                        return;
                    }
                }

                //if no skills required, we don't care about the user's skills
                if(peopleNeed.skills.length === 0){
                    result.push(peopleNeed);
                    return;
                }

                //skills : if not empty, user must have all the required skill
                var userHaveAllRequiredSkills = true;
                _.each(peopleNeed.skills,(skill) => {
                   if(!_.contains(selectedUser.skills,skill)){
                       userHaveAllRequiredSkills = false;
                   }
                });
                if(userHaveAllRequiredSkills){
                    result.push(peopleNeed);
                    return;
                }
            });

            return result;

        } else {
            return peopleNeeded;
        }



        var skills = timeSlot.skills;
    }



});

Template.assignmentTasksList.events({
    "click li.peopleNeed": function (event) {
        event.stopPropagation();
        var currentAssignmentType = CurrentAssignmentType.get();
        var target = $(event.target);
        var _idTask, _idTimeSlot;
        if (target.hasClass("task"))
            _idTask = target.data("_id");
        else
            _idTask = target.parents(".task").data("_id");

        var peopleNeed = this;

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:

                if (target.hasClass("time-slot"))
                    _idTimeSlot = target.data("_id");
                else
                    _idTimeSlot = target.parents(".time-slot").data("_id");

                Meteor.call("assignUserToTaskTimeSlot", SelectedUser.get()._id, _idTask, _idTimeSlot, peopleNeed);

                break;
            case AssignmentType.TASKTOUSER:
                SelectedTask.set({_id: _idTask});
                //selectedTimeslotId = null;//TODO pas top
                UserFilter.set(noneFilter);
                //TODO aouter du CSS pour signifier quelle tache est la current
                break;
        }


    }
});
