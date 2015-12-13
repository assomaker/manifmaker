Template.assignmentTasksList.helpers({
    tasks: function () {
        var filter = TaskFilter.get();
        var filterIndex = TaskIndexFilter.get();
        var teamFilter = TaskTeamFilter.get();


        var searchResult;
        var filterResult;

        //filterResult = Tasks.find(filter);
        filterResult = Tasks.find({
            $and: [
                filter,
                teamFilter
            ]
        }, {limit: 20}).fetch();

        searchResult = TasksIndex.search(filterIndex, {limit: 20}).fetch();

        return _.intersectionObjects(searchResult, filterResult);

    },

    "allTeams": function () {
        return Teams.find();
    }
});

Template.assignmentTasksList.events({
    "click .href-assignment-task": function (event) {
        event.stopPropagation();
        event.preventDefault();
        //TODO can't event to bubble to the collapsible event

        console.info("routing", "/assignment/task/" + this._id);
        Router.go("/assignment/task/" + this._id);
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


    "keyup #search_task_name": function (event) {
        var searchInput = $("#search_task_name").val();

        //desactivation de la recherche par URL
        //console.info("routing", "/assignment/task/search/"+query);
        //Router.go("/assignment/task/search/"+query);

        if (searchInput === "") {
            TaskIndexFilter.set(noSearchFilter);
        } else {
            TaskIndexFilter.set(searchInput);
        }
    },

    "change #filter_team_task": function (event) {
        var _id = $(event.target).val();
        if (_id === "") {
            TaskTeamFilter.set(defaultFilter);
            $("#filter_team_task_option_advice_all").text("Choose a team"); //TODO label
        }else {
            TaskTeamFilter.set({
                team: _id
            });
            $("#filter_team_task_option_advice_all").text("All teams"); //TODO label
        }



    }
});
