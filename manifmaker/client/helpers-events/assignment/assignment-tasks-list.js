Template.assignmentTasksList.helpers({
    tasks: function () {
        var filter = TaskFilter.get();
        var filterIndex = TaskIndexFilter.get();

        if (filter != TaskFilterBefore) {
            TaskFilterBefore = filter;
            return Tasks.find(filter);
        }
        if (filterIndex != TaskIndexFilterBefore) {
            TaskIndexFilterBefore = filterIndex;
            return TasksIndex.search(filterIndex, {limit: 20}).fetch();
        }

    }
});

TaskFilterBefore = null;
TaskIndexFilterBefore = null;

Template.assignmentTasksList.events({
    "click .href-assignment-task": function(event){
        event.stopPropagation();
        event.preventDefault();

        Router.go("/assignment/task/"+this._id);
    },

    "click li": function (event) {
        event.stopPropagation();
        var currentAssignmentType = CurrentAssignmentType.get();
        var target = $(event.target);
        var _idTask, _idTimeSlot;
        if (target.hasClass("task"))
            _idTask = target.data("_id");
        else
            _idTask = target.parents(".task").data("_id");

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:

                if (target.hasClass("time-slot"))
                    _idTimeSlot = target.data("_id");
                else
                    _idTimeSlot = target.parents(".time-slot").data("_id");

                Meteor.call("assignUserToTaskTimeSlot", SelectedUser.get()._id, _idTask, _idTimeSlot);

                break;
            case AssignmentType.TASKTOUSER:
                //SelectedTask.set({_id: _idTask});
                //selectedTimeslotId = null;//TODO pas top
                //UserFilter.set(noneFilter);
                ////TODO aouter du CSS pour signifier quelle tache est la current
                break;
        }


    },


    "keyup #task_name": function (event) {
        var query = $("#task_name").val();

        Router.go("/assignment/task/search/" + query);
    }
});
