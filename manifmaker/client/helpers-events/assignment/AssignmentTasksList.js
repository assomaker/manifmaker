import {AssignmentReactiveVars} from "./AssignmentReactiveVars"

class AssignmentTasksList extends BlazeComponent {
    constructor(parent) {
        super();
        this.taskTeamFilter = new ReactiveVar(AssignmentReactiveVars.defaultFilter);
        this.isplayAssignedTask = new ReactiveVar(false);
        this.taskSkillsFilter = new ReactiveVar(null);
        this.taskNeededTeamFilter = new ReactiveVar(null); //ok

    }

    events() {
        return [{
            "click .href-assignment-task": this.onClickTaskName,
            "click .task": this.onClickTask,
            "click li.peopleNeed": this.onClickPeopleNeed,
            "keyup #search_task_name": this.performSearch,
            "change .filter_team": this.performFilterTeam,
            "change #filter_needed_team_task": this.performFilterNeededTeam,
            "change #filter_skills_task": this.performFilterSkills,
            "change #display-assigned-task-checkbox": this.switchDisplayAssignedTask
        }]
    }
    

    onClickTaskName(event) {
        console.info("routing", "/assignment/task/" + this.currentData()._id);
        Router.go("/assignment/task/" + this.currentData()._id);
    }

    onClickTask(event) {
        AssignmentReactiveVars.SelectedTaskBreadCrumb.set(this.currentData());
    }

    onClickPeopleNeed(event) {
        event.stopPropagation();
        var currentAssignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();
        var isUnassignment = AssignmentReactiveVars.IsUnassignment.get();
        var target = $(event.target);
        var _idTask, _idTimeSlot;
        if (target.hasClass("task"))
            _idTask = target.data("_id");
        else
            _idTask = target.parents(".task").data("_id");

        AssignmentReactiveVars.SelectedPeopleNeed.set(this.currentData());

        var userId = AssignmentReactiveVars.SelectedUser.get()._id;


        if (target.hasClass("time-slot"))
            _idTimeSlot = target.data("_id");
        else
            _idTimeSlot = target.parents(".time-slot").data("_id");

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                if (isUnassignment) {
                    Meteor.call("removeAssignUserToTaskTimeSlot", AssignmentReactiveVars.SelectedPeopleNeed.get()._id, userId);
                    AssignmentReactiveVars.IsUnassignment.set(false);
                } else
                    Meteor.call("assignUserToTaskTimeSlot", AssignmentReactiveVars.SelectedPeopleNeed.get()._id, userId, function (error, result) {
                        if (!error) {
                            //we have to reset the task list this way because once assigned, the task can't propose any peopleNeed for the user as he is
                            //no longer available but the task can still be theoretically assigned to him because we didn't recompute the AssignmentReactiveVars.TaskFilter job done
                            //by the event on the calendar.
                            //we don't need to do that for the mode TASKTOUSER as the user naturally disappears from the list once assigned
                            AssignmentReactiveVars.TaskFilter.set(AssignmentReactiveVars.noneFilter);

                            //reset workflow
                            AssignmentReactiveVars.SelectedAvailability.set(null);
                        }
                    });
                break;
            case AssignmentType.TASKTOUSER:
                break;
        }


    }


    performSearch(event) {
        var searchInput = $("#search_task_name").val();

        //desactivation de la recherche par URL
        //console.info("routing", "/assignment/task/search/"+query);
        //Router.go("/assignment/task/search/"+query);

        if (searchInput === "") {
            AssignmentReactiveVars.TaskIndexFilter.set(AssignmentReactiveVars.noSearchFilter);
        } else {
            AssignmentReactiveVars.TaskIndexFilter.set(searchInput);
        }
    }

    performFilterTeam(event) {
        var _id = $(event.target).val();
        if (_id === "") {
            this.taskTeamFilter.set(AssignmentReactiveVars.defaultFilter);
        } else {
            this.taskTeamFilter.set({
                teamId: _id
            });
        }
    }

    performFilterNeededTeam(event) {
        var _id = $(event.target).val();
        if (_id === "") {
            this.taskNeededTeamFilter.set(null);
        } else if (_id === "noNeededTeam") {
            this.taskNeededTeamFilter.set("noNeededTeam");
        }
        else {
            this.taskNeededTeamFilter.set(_id);
        }
    }

    performFilterSkills(event) {
        var _ids = $(event.target).val();
        if (!_ids) {
            this.taskSkillsFilter.set(null);
        } else if (_ids[0] === "noSkills") {
            this.taskSkillsFilter.set([]);
        } else {
            this.taskSkillsFilter.set(_ids);
        }
    }

    switchDisplayAssignedTask(event) {
        this.isplayAssignedTask.set($($(event.target)[0]).is(':checked'));
    }


    tasks() {
        var filter = AssignmentReactiveVars.TaskFilter.get();
        var filterIndex = AssignmentReactiveVars.TaskIndexFilter.get();
        var teamFilter = this.taskTeamFilter.get();
        var displayAssignedTask = this.isplayAssignedTask.get();
        var assignmentType = AssignmentReactiveVars.CurrentAssignmentType.get();

        var skillsFilter = this.taskSkillsFilter.get();
        var neededTeamFilter = this.taskNeededTeamFilter.get();
        var skillsAndNeededTeamFilterForAssigned = {};

        if (displayAssignedTask && assignmentType === AssignmentType.TASKTOUSER) {
            skillsAndNeededTeamFilterForAssigned = {
                timeSlots: {
                    $elemMatch: {
                        peopleNeededAssigned: {
                            $elemMatch: {
                                //below attributes will be added just after as it
                                //skills: skillsFilter,
                                //teamId: neededTeamFilter
                            }
                        }
                    }
                }
            };
            if (skillsFilter)
                skillsAndNeededTeamFilter.timeSlots.$elemMatch.peopleNeededAssigned.$elemMatch.skills = {$all: skillsFilter};
            if (neededTeamFilter) {
                if (neededTeamFilter === "noNeededTeam")
                    skillsAndNeededTeamFilter.timeSlots.$elemMatch.peopleNeededAssigned.$elemMatch.teamId = null;
                else
                    skillsAndNeededTeamFilter.timeSlots.$elemMatch.peopleNeededAssigned.$elemMatch.teamId = neededTeamFilter;
            }
        }
        var skillsAndNeededTeamFilter = {
            timeSlots: {
                $elemMatch: {
                    peopleNeeded: {
                        $elemMatch: {
                            //below attributes will be added just after as it
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

        if (displayAssignedTask && assignmentType === AssignmentType.TASKTOUSER) {
            filterResult = Tasks.find({
                $and: [
                    filter,
                    teamFilter,
                    {
                        $or: [
                            skillsAndNeededTeamFilter,
                            skillsAndNeededTeamFilterForAssigned
                        ]
                    }
                ]
            }, {limit: 20}).fetch();
        } else {
            filterResult = Tasks.find({
                $and: [
                    filter,
                    teamFilter,
                    skillsAndNeededTeamFilter,
                ]
            }, {limit: 20}).fetch();
        }

        searchResult = TasksIndex.search(filterIndex, {limit: 20}).fetch();
        return _.intersectionObjects(searchResult, filterResult);
    }

    team() {
        return Teams.findOne({_id: this.currentData().teamId}).name;
    }

    user() {
        return Users.findOne({_id: this.currentData().userId}).name;
    }

    timeSlotsInfo() {
        var task = this.currentData();
        var timeSlots = task.timeSlots;
        if (AssignmentReactiveVars.CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {
            var result = [];
            _.each(timeSlots, (timeSlot) => {
                var date = AssignmentReactiveVars.SelectedDate.get();
                var start = new moment(timeSlot.start);
                var end = new moment(timeSlot.end);
                if ((start.isBefore(date) || start.isSame(date)) &&
                    (end.isAfter(date) || end.isSame(date))) {
                    result.push(timeSlot);
                }
            });

            var string = " - "
            _.each(result, function (timeSlot) {
                string += new moment(timeSlot.start).format("H[h]mm") + " - " + new moment(timeSlot.end).format("H[h]mm");
            });
            return string;
        } else {
            return; //timeSlot infos can be directly see in the calendar
        }
    }

    timeSlots() {
        var task = this.currentData();
        var timeSlots = task.timeSlots;
        if (AssignmentReactiveVars.CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {
            var result = [];
            _.each(timeSlots, (timeSlot) => {
                var date = AssignmentReactiveVars.SelectedDate.get();
                var start = new moment(timeSlot.start);
                var end = new moment(timeSlot.end);
                if ((start.isBefore(date) || start.isSame(date)) &&
                    (end.isAfter(date) || end.isSame(date))) {
                    result.push(timeSlot);
                }
            });
            return result;
        } else {
            return []; //timeSlot infos can be directly see in the calendar
        }
    }

    peopleNeeded() {
        var peopleNeeded = this.currentData().peopleNeeded;

        if (AssignmentReactiveVars.CurrentAssignmentType.get() === AssignmentType.USERTOTASK) {
            var result = [];

            _.each(peopleNeeded, (peopleNeed) => {
                var selectedUser = Users.findOne(AssignmentReactiveVars.SelectedUser.get());

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

    neededTeamOptions() {
        return {
            chooseLabel: "Choose a needed team",
        };
    }

    responsibleTeamOptions() {
        return {
            chooseLabel: "Choose a responsible team",
        };
    }


}

AssignmentTasksList.register("AssignmentTasksList");






