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
        return CalendarDays.find({});
    },
    hours: function () {
        return CalendarHours.find({});
    },
    quarter: function () {
        return CalendarQuarter.find({});
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
                var accuracy = CalendarAccuracy.findOne().accuracy;

                var data = {}, founded;

                if (availabilityFound !== null) {
                    data.state = "available";
                    data.name = user.name;

                    founded = availabilityFound;
                } else if (assignmentFound !== null) {
                    data.name = assignmentFound.taskName;
                    data.state = "affecte";

                    founded = assignmentFound;
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
                var accuracy = CalendarAccuracy.findOne().accuracy;

                var data = {}, founded;

                if (timeSlotFound !== null) {
                    data.state = "available";
                    data.name = task.name;

                    founded = timeSlotFound;
                }
                if (assignmentsFound.length !== 0) { //at least one assignment TODO code couleur d'avancement en fonction des peoples needed
                    data.name = assignmentsFound[0].taskName; //idem, la meme task
                    data.state = "in-progress";

                    founded = assignmentsFound[0]; //normalement ils ont tous les memes date, TODO controler ca
                }

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
        switch (CalendarAccuracy.findOne({}).accuracy) {
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
        switch (CalendarAccuracy.findOne({}).accuracy) {
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
    }

});


Template.assignmentCalendar.events({
    //taskToUser (we click on a complete task time slot)
    "click .creneau": function (event) {
        //TODO gerer le double click pour la desaffectation

        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                console.error("Template.assignmentCalendar.events.click .creneau", "User can't normally click on this kind of element when in userToTask");
                return;
                break;
            case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                var selectedTimeSlot = this;
                selectedTimeslotId = selectedTimeSlot._id;

                var task = Tasks.findOne({_id: selectedTimeSlot.taskId});
                var timeSlot = TimeSlotService.getTimeSlot(task, selectedTimeSlot._id);

                var skillsFilter = {};
                //TODO match des skills (du user) avec les skills du timeSlot
                //bddd.user.skills sont des ID
                //timeslot.peopleNeeded.skills sont des ID


                //pour chaque timeSlot.peopleNeeded PN
                //si PN.userId !== null => on prend le user tq user._id = PN.userId


                //sinon si PN.teamId !== null => on prend tous les user.teamId = PN.teamId


                //si PN.skills != empty  => on prend les users (users.skills) qui ont au moins toutes les PN.skills
                //var task = Tasks.findOne({name: "task2"});
                //var timeSlot = task.timeSlots[0];
                //var askingSkills = timeSlot.peopleNeeded[0].skills;
                //var askingSkills1 = timeSlot.peopleNeeded[1].skills;
                var askingSkills = [];
                timeSlot.peopleNeeded.forEach(peopleNeeded => {
                        askingSkills.push({skills: {$all: peopleNeeded.skills}});
                    }
                );



                var skillsFilter = {
                    $or: askingSkills
                };
                //Users.find(skillsFilter).fetch();


                //avec le jeu de test actuel : [0] => user1   [1]  => user2


                //TODO peut etre utiliser un &elemMatch pour faire pour tous les peopleNeeded => non, mais pour USERTOTASK


                //pour chaque peopleNeeded.skills, il faut que le user les aient tous pour que ce soit bon
                //
                //skillsFilter = {
                //    skills: {
                //        $in: []
                //    }
                //};


                var availabilitiesFilter = {
                    availabilities: {
                        $elemMatch: {
                            start: {$lte: timeSlot.start},
                            end: {$gte: timeSlot.end}
                        }
                    }
                };

                var newFilter = {
                    $and: [
                        availabilitiesFilter, skillsFilter
                    ]
                };


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

                var userId = SelectedUser.get()._id;
                var user = Users.findOne({_id: userId});
                var availability = AvailabilityService.getSurroundingAvailability(user, selectedDate);

                if (typeof availability === "undefined") {
                    console.error("Template.assignmentCalendar.events.click .heure, .quart_heure", "User can't normally click on this kind of element when in userToTask");
                    return;
                }
                selectedAvailability = availability;





                var skillsFilter = {};

                //pour traiter userId != null et teamId != null
                //TODO


                //pour ne traiter que les skills
                //toutes les fiches taches qui ont au moins un timeSlot qui a au moins un peopleNeed dont les skills sont tous dans le user.skills

                var skillsFilter = {
                    'timeSlots.each.peopleNeeded.each.skills' : user.skills
                };


                var user = Users.findOne({name:"user1"});
                var askedSkills = user.skills;


                skillsFilter = {
                    timeSlots : {
                        $elemMatch: {
                            peopleNeeded : {
                                $elemMatch : {
                                    skills : askedSkills
                                }
                            }
                        }
                    }
                };
                Tasks.find(skillsFilter).fetch();



                //TODO match des skills (du user) avec les skills de toutes les taches tous les timeslots qui match la selected hours
                //bddd.user.skills sont des ID
                //timeslot.peopleNeeded.skills sont des ID


                //pour chaque timeSlot.peopleNeeded PN
                //si PN.userId !== null => on prend le user tq user._id = PN.userId


                //sinon si PN.teamId !== null => on prend tous les user.teamId = PN.teamId


                //si PN.skills != empty  => on prend les users (users.skills) qui ont au moins toutes les PN.skills
                //var task = Tasks.findOne({name: "task2"});
                //var timeSlot = task.timeSlots[0];
                //var askingSkills = timeSlot.peopleNeeded[0].skills;
                //var askingSkills1 = timeSlot.peopleNeeded[1].skills;
                var askingSkills = [];
                timeSlot.peopleNeeded.forEach(peopleNeeded => {
                        askingSkills.push({skills: {$all: peopleNeeded.skills}});
                    }
                );





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
                break;
            case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                //we let the event bubbles to the parent
                return [];
        }
    }
});




