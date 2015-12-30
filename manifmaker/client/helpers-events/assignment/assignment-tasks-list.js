Template.assignmentTasksList.helpers({
    tasks: function () {
        var filter = TaskFilter.get();
        var filterIndex = TaskIndexFilter.get();
        var teamFilter = TaskTeamFilter.get();

        var skillsFilter = TaskSkillsFilter.get();
        var neededTeamFilter = TaskNeededTeamFilter.get();
        var skillsAndNeededTeamFilter = {
            timeSlots: {
                $elemMatch: {
                    peopleNeeded: {
                        $elemMatch: {
                            //skills: skillsFilter,
                            //teamId: neededTeamFilter
                        }
                    }
                }
            }
        };
        if (skillsFilter)
            skillsAndNeededTeamFilter.timeSlots.$elemMatch.peopleNeeded.$elemMatch.skills = {$all: skillsFilter};
        if (neededTeamFilter) {
            if (neededTeamFilter === "noNeededTeam")
                skillsAndNeededTeamFilter.timeSlots.$elemMatch.peopleNeeded.$elemMatch.teamId = null;
            else
                skillsAndNeededTeamFilter.timeSlots.$elemMatch.peopleNeeded.$elemMatch.teamId = neededTeamFilter;
        }

        var searchResult;
        var filterResult;

        filterResult = Tasks.find({
            $and: [
                filter,
                teamFilter,
                skillsAndNeededTeamFilter
            ]
        }, {limit: 20}).fetch();

        searchResult = TasksIndex.search(filterIndex, {limit: 20}).fetch();
        return _.intersectionObjects(searchResult, filterResult);
    },
    team: function () {
        return Teams.findOne({_id: this.teamId}).name;
    },
    user: function () {
        return Users.findOne({_id: this.userId}).name;
    },

    timeSlots: function () {
        var task = this;
        var timeSlots = task.timeSlots;
        if (CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {
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

    peopleNeeded: function () {
        var peopleNeeded = this.peopleNeeded;

        if (CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {
            var result = [];

            _.each(peopleNeeded, (peopleNeed) => {
                var selectedUser = Users.findOne(SelectedUser.get());

                //userId : if existing, selected user must be the one
                if (peopleNeed.userId) {
                    if (peopleNeed.userId === selectedUser._id) {
                        result.push(peopleNeed);
                        return;
                    }
                    return;
                }


                //teamId : if existing, selected user must at least have the required team
                if (peopleNeed.teamId) {
                    if (!_.contains(selectedUser.teams, peopleNeed.teamId)) {
                        return;
                    }
                }

                //if no skills required, we don't care about the user's skills
                if (peopleNeed.skills.length === 0) {
                    result.push(peopleNeed);
                    return;
                }

                //skills : if not empty, user must have all the required skill
                var userHaveAllRequiredSkills = true;
                _.each(peopleNeed.skills, (skill) => {
                    if (!_.contains(selectedUser.skills, skill)) {
                        userHaveAllRequiredSkills = false;
                    }
                });
                if (userHaveAllRequiredSkills) {
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
    "click .href-assignment-task": function (event) {
        console.info("routing", "/assignment/task/" + this._id);
        Router.go("/assignment/task/" + this._id);
    },


    "click li.peopleNeed": function (event) {
        event.stopPropagation();
        var currentAssignmentType = CurrentAssignmentType.get();
        var isUnassignment = IsUnassignment.get();
        var target = $(event.target);
        var _idTask, _idTimeSlot;
        if (target.hasClass("task"))
            _idTask = target.data("_id");
        else
            _idTask = target.parents(".task").data("_id");

        selectedPeopleNeed = this;


        if (target.hasClass("time-slot"))
            _idTimeSlot = target.data("_id");
        else
            _idTimeSlot = target.parents(".time-slot").data("_id");

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                if (isUnassignment) {
                    Meteor.call("removeAssignUserToTaskTimeSlot", SelectedUser.get()._id, _idTask, _idTimeSlot, selectedPeopleNeed);
                    IsUnassignment.set(false);
                } else
                    Meteor.call("assignUserToTaskTimeSlot", SelectedUser.get()._id, _idTask, _idTimeSlot, selectedPeopleNeed);
                break;
            case AssignmentType.TASKTOUSER:
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
            $("#filter_team_task_option_advice_all").text("Choose a responsible team"); //TODO label
        } else {
            TaskTeamFilter.set({
                teamId: _id
            });
            $("#filter_team_task_option_advice_all").text("All teams"); //TODO label
        }
    },
    "change #filter_needed_team_task": function (event) {
        var _id = $(event.target).val();
        if (_id === "") {
            TaskNeededTeamFilter.set(null);
            $("#filter_needed_team_task_option_advice_all").text("Choose a needed team"); //TODO label
        } else if (_id === "noNeededTeam") {
            TaskNeededTeamFilter.set("noNeededTeam");
            $("#filter_needed_team_task_option_advice_all").text("All teams"); //TODO label
        }
        else {
            TaskNeededTeamFilter.set(_id);
            $("#filter_needed_team_task_option_advice_all").text("All teams"); //TODO label
        }
    },

    "change #filter_skills_task": function (event) {
        var _ids = $(event.target).val();
        if (!_ids) {
            TaskSkillsFilter.set(null);
        } else if (_ids[0] === "noSkills") {
            TaskSkillsFilter.set([]);
        } else {
            TaskSkillsFilter.set(_ids);
        }
    }
});
