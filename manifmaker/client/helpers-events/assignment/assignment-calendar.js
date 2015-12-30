function getCalendarDateHours(date, timeHours) {
    var date = new moment(date);
    date.hours(timeHours);
    return date;
}
function getCalendarDateTime(date, timeHours, timeMinutes) {
    var dateWithHours = getCalendarDateHours(date, timeHours);
    var date = new moment(dateWithHours);
    date.minutes(timeMinutes);
    return date;
}
Template.assignmentCalendar.helpers({
    assignmentType: function () {
        return CurrentAssignmentType.get();
    },
    days: function () {
        return AssignmentCalendarDisplayedDays.find({});
    },
    hours: function () {
        return AssignmentCalendarDisplayedHours.find({});
    },
    quarter: function () {
        return AssignmentCalendarDisplayedQuarter.find({});
    },
    displayCalendarTitleDate: function (date) {
        return new moment(date).format("dddd DD/MM");
    },
    hoursDate: function (date) {
        return getCalendarDateHours(date, this.date);
    },
    quarterDate: function (date, timeHours) {
        return getCalendarDateTime(date, timeHours, this.quarter);
    },

    labelSkills: function () {
        return Skills.findOne({_id: this.toString()}).label;
    },

    userName: function () {
        return Users.findOne({_id: this.userId}).name;
    },

    teamName: function () {
        return Teams.findOne({_id: this.teamId}).name;
    },


    timeSlot: function (date, timeHours, idTask) {
        var startCalendarTimeSlot = getCalendarDateTime(date, timeHours);
        var currentAssignmentType = CurrentAssignmentType.get();

        var data = {};

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                var user = SelectedUser.get() == null ? null : Users.findOne(SelectedUser.get());
                if (user === null) return [];


                var availabilityFound = AvailabilityService.getAvailabilityByStart(user.availabilities, startCalendarTimeSlot);
                var assignmentFound = AssignmentService.getAssignmentByStart(user.assignments, startCalendarTimeSlot);

                if (availabilityFound === null && assignmentFound === null) return [];
                if (availabilityFound !== null && assignmentFound !== null) {
                    console.error("Calendar.timeSlot : error while displaying user info, both availability and assignment has been found. \nuser", user, " => availability", availabilityFound, " and assignment", assignmentFound);
                    return [];
                }

                var baseOneHourHeight = 40;
                var accuracy = AssignmentCalendarDisplayedAccuracy.findOne().accuracy;

                var data = {}, founded;

                if (availabilityFound !== null) {
                    data.state = "available";
                    data.name = user.name;

                    founded = availabilityFound;
                } else if (assignmentFound !== null) {
                    data.name = assignmentFound.taskName;
                    data.state = "affecte";

                    founded = assignmentFound;

                    data.taskName = founded.taskName;
                }

                _.extend(data, founded);
                var end = new moment(founded.end);
                var start = new moment(founded.start);
                var duration = end.diff(start) / (3600 * 1000);

                var height = accuracy * baseOneHourHeight * duration;
                data.height = height + "px";

                break;
            case AssignmentType.TASKTOUSER:
                var task = SelectedTask.get() == null ? null : Tasks.findOne(SelectedTask.get());
                if (task === null) return [];

                var timeSlotFound = TimeSlotService.getTimeSlotByStart(task.timeSlots, startCalendarTimeSlot);
                var assignmentsFound = AssignmentService.getAssignmentByStart(task.assignments, startCalendarTimeSlot, true);

                if (timeSlotFound === null && assignmentsFound.length === 0) return [];


                var baseOneHourHeight = 40;
                var accuracy = AssignmentCalendarDisplayedAccuracy.findOne().accuracy;

                var data = {}, founded;

                if (timeSlotFound !== null) {
                    data.state = "available";
                    //data.name = task.name;
                    //Template.parentData() doesn't work so we use a trick
                    data.taskId = task._id;

                    founded = timeSlotFound;

                    //people need
                    var peopleNeeds = founded.peopleNeeded;
                    data.peopleNeeded = peopleNeeds;

                }

                //if (assignmentsFound.length !== 0) { //at least one assignment TODO code couleur d'avancement en fonction des peoples needed
                //    data.name = assignmentsFound[0].taskName; //idem, la meme task
                //    data.state = "in-progress";
                //    data.taskId = task._id;
                //
                //
                //    founded = assignmentsFound[0]; //normalement ils ont tous les memes date, TODO controler ca
                //}


                _.extend(data, founded);
                var end = new moment(founded.end);
                var start = new moment(founded.start);
                var duration = end.diff(start) / (3600 * 1000);

                var height = accuracy * baseOneHourHeight * duration;
                data.height = height + "px";

                break;
            case AssignmentType.ALL:
                return [];
        }


        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    },
    sideHoursHeight: function () {
        switch (AssignmentCalendarDisplayedAccuracy.findOne({}).accuracy) {
            case 0.25 :
                return "oneHour";
            case  0.5 :
                return "oneHour";
            case 1:
                return "oneHour";
            case  2:
                return "twoHour"
            case 4:
                return "fourHour"
        }
    },
    quarterHeight: function () {
        switch (AssignmentCalendarDisplayedAccuracy.findOne({}).accuracy) {
            case 0.25 :
                return "quarterHour";
            case  0.5 :
                return "halfHour";
            case 1:
                return "oneHour";
            case  2:
                return "twoHour"
            case 4:
                return "fourHour"
        }
    },
    //works for .heure et .quart d'heure
    isSelected: function (date, timeHours) {
        if(getCalendarDateTime(date, timeHours, 0).isSame(SelectedDate.get())){
            return "selected"
        }
        return ""
    }

});

selectedPeopleNeed = null;


var peopleNeedAssignedClick = 0;

Template.assignmentCalendar.events({
    "click .peopleNeed": function () {
        selectedPeopleNeed = this;

        //event should bubbles to .creneau
    },

    "click .peopleNeed.assigned": function (event) {
        event.stopPropagation();
        peopleNeedAssignedClick++;
        if (peopleNeedAssignedClick == 1) {
            setTimeout(_.bind(function () {
                if (peopleNeedAssignedClick == 1) {
                    console.info("click on peopleNeed.assigned : double click to perform remove assignment");
                } else {
                    console.info("dblclick on peopleNeed.assigned : TODO remove assignment");

                    var currentAssignmentType = CurrentAssignmentType.get();

                    switch (currentAssignmentType) {
                        case AssignmentType.USERTOTASK:
                            console.error("Template.assignmentCalendar.events.dblclick .creneau", "User can't normally dlb click on this kind of element when in userToTask");
                            return;
                            break;
                        case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                            var peopleNeeded = selectedPeopleNeed;

                            var assignment = Assignments.findOne({
                                peopleNeedId: peopleNeeded._id
                            });

                            var newFilter = {
                                _id: assignment.userId
                            };

                            UserFilter.set(newFilter);
                            IsUnassignment.set(true);
                            break;
                    }
                }
                peopleNeedAssignedClick = 0;
            },this), 300);
        }

    },

    "hover .creneau": function () {
        selectedTimeSlot = this;
    },

    //taskToUser (we click on a complete task time slot)
    "click .creneau": function () {

        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                console.error("Template.assignmentCalendar.events.click .creneau", "User can't normally click on this kind of element when in userToTask");
                return;
                break;
            case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                selectedTimeSlot = this;
                selectedTimeslotId = selectedTimeSlot._id;

                //Template.parentData() doesn't work so we use a trick to retrieve taskId
                var task = Tasks.findOne({_id: selectedTimeSlot.taskId});
                var timeSlot = TimeSlotService.getTimeSlot(task, selectedTimeSlot._id);

                /**
                 *
                 * By now, userId, teamId and skills can't be combined.
                 * In particular we can't ask for a specific team and for specific skills (will be soon)
                 *
                 * Skills filter
                 *
                 * For selected task's time slot, the user must have all the required skills of at least
                 * one of task's people need
                 *
                 */
                var peopleNeeded = selectedPeopleNeed;
                var askingSpecificNeedAndSkills = [];
                if (peopleNeeded.userId) { //prior above teamId an skills
                    askingSpecificNeedAndSkills.push({
                        _id: peopleNeeded.userId
                    });
                } else if (peopleNeeded.teamId && peopleNeeded.skills.length !== 0) {  //we combine teamId and skills
                    askingSpecificNeedAndSkills.push({
                        $and: [
                            {
                                teams: peopleNeeded.teamId
                            },
                            {
                                skills: {
                                    $all: peopleNeeded.skills
                                }
                            }
                        ]
                    });
                } else if (peopleNeeded.teamId) { //we only use teamId
                    askingSpecificNeedAndSkills.push({
                        teams: peopleNeeded.teamId
                    });
                } else if (peopleNeeded.skills.length !== 0) //if people need doesn't require any particular skills
                    askingSpecificNeedAndSkills.push({skills: {$all: peopleNeeded.skills}});

                var userTeamsSkillsFilter;
                if (askingSpecificNeedAndSkills.length !== 0) //if all time slot's people need don't require any particular skills
                    userTeamsSkillsFilter = {
                        $or: askingSpecificNeedAndSkills
                    };


                var availabilitiesFilter = {
                    availabilities: {
                        $elemMatch: {
                            start: {$lte: timeSlot.start},
                            end: {$gte: timeSlot.end}
                        }
                    }
                };

                /**
                 * The user must be free during the time slot duration and have skills that match the required ones
                 */
                var newFilter = {
                    $and: [
                        availabilitiesFilter,
                        userTeamsSkillsFilter
                    ]
                };
                console.info("TASKTOUSER user filter", newFilter);


                UserFilter.set(newFilter);
                break;
        }
    },

    //userToTask (we click on a creneau, not on the entire availability)
    "click .heure, .quart_heure": function (event) {
        //TODO gerer le double click pour la desaffectation

        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK://only display task that have at least one time slot matching the selected availability slot

                //what time did we click on ?
                var $target = $(event.target);

                var selectedDate = null;
                if (typeof $target.attr("hours") !== "undefined") {
                    selectedDate = new moment(new Date($target.attr("hours")));
                } else if (typeof $target.attr("quarter") !== "undefined") {
                    selectedDate = new moment(new Date($target.attr("quarter")));
                }
                selectedDateUserToTask = selectedDate;


                var userId = SelectedUser.get()._id;
                var user = Users.findOne({_id: userId});
                var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);

                if (typeof availability === "undefined") {
                    console.error("Template.assignmentCalendar.events.click .heure, .quart_heure", "User can't normally click on this kind of element when in userToTask");
                    return;
                }
                selectedAvailability = availability;


                /*
                 ** Skills filter
                 User is eligible for a task if he has all skills for at least one task' people need's skills.
                 The query looks like something like this : 'foreach timeSlot foreach peopleNeeded foreach skills' = at least user.skills
                 ** Availabilities filter :
                 Task whose have at least one timeSlot (to begin, just one) as
                 user.selectedAvailabilities.start <= task.timeslot.start <= selectedDate and
                 selectedDate <=  task.timeslot.end <=  user.Dispocorrespante.end
                 Foreach task's time slot, we need a matching skills and a matching availability
                 */

                var newFilter = {
                    $or: [ //$or does't work on $elemMatch with miniMongo, so we use it here
                        { //userId filter
                            timeSlots: {
                                $elemMatch: {
                                    //skills filter
                                    peopleNeeded: {
                                        $elemMatch: {
                                            userId: user._id
                                        }
                                    }
                                },
                                //availabilities filter
                                // start: {$gte: availability.start, $lte: selectedDate.toDate()},
                                // end: {$gt: selectedDate.toDate(), $lte: availability.end}
                            }
                        },
                        {
                            $or: [ //either we match skills requirement or there is no skills requirement (and we don't care)
                                { //skills filter
                                    timeSlots: {
                                        $elemMatch: {
                                            //skills filter
                                            peopleNeeded: {
                                                $elemMatch: {
                                                    skills: user.skills,
                                                    teamId: {
                                                        $in: user.teams
                                                    }
                                                    //{  ////=> or just skills : user.skills (what the differences ?)
                                                    //    $elemMatch: {
                                                    //        $in: user.skills
                                                    //    }
                                                    //}
                                                }
                                            },
                                            //availabilities filter
                                            start: {$gte: availability.start, $lte: selectedDate.toDate()},
                                            end: {$gt: selectedDate.toDate(), $lte: availability.end}
                                        }
                                    }
                                },
                                {//no-skills filter
                                    timeSlots: {
                                        $elemMatch: {
                                            //skills filter
                                            peopleNeeded: {
                                                $elemMatch: {
                                                    skills: { // $eq : [] doesn't work with miniMongo, here is a trick
                                                        $not: {
                                                            $ne: []
                                                        }
                                                    },
                                                    teamId: {
                                                        $in: user.teams
                                                    }
                                                }
                                            },
                                            //availabilities filter
                                            start: {$gte: availability.start, $lte: selectedDate.toDate()},
                                            end: {$gt: selectedDate.toDate(), $lte: availability.end}
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                };
                //aggregate is not supported by mini mongo


                TaskFilter.set(newFilter);
                break;
            case
            AssignmentType.TASKTOUSER:
                //only display users that have at least one availability matching the selected time slot
                //we let the event bubbles to the parent
                return [];
        }
    }
});





