TimeSlotService =
    class TimeSlotService {
        static getTimeSlot(task, timeSlotId) {
            console.info("TimeSlotService.getTimeSlot timeSlot", timeSlotId, "for task", task);
            if (typeof task !== "object")
                task = Tasks.findOne(task);
            var found;
            task.timeSlots.forEach(timeSlot => {
                if (timeSlot._id === timeSlotId) {
                    found = timeSlot;//TimeSlotService.read(timeSlot);
                    return false;
                }
            });
            return found;
        }

        static getTimeSlotIndex(task, timeSlotId) {
            console.info("TimeSlotService.getTimeSlot timeSlot", timeSlotId, "for task", task);
            var found;
            var i = 0;
            task.timeSlots.forEach(timeSlot => {
                if (timeSlot._id === timeSlotId) {
                    found = i;
                    return false;
                }
                i++;
            });
            return found;
        }

        static getTimeSlotByStart(availabilitiesOrTimeSlotsOrAssignments, start, several = false) {
            if (several) {
                var found = [];
            } else {
                var found = null;
            }
            var startDate = new moment(new Date(start));
            availabilitiesOrTimeSlotsOrAssignments.forEach(thing => {
                //we only take the first matching timeSlot, le css ne sait aps encore gerer deux data timeSlot sur un meme calendar timeSlot
                if (startDate.isSame(new moment(new Date(thing.start)))) {
                    if (several) {
                        found.push(thing)
                    } else {
                        found = thing;
                        return false;
                    }
                }
            });
            return found;
        }

        static getTimeSlotAssignedByStart(availabilitiesOrTimeSlotsOrAssignments, start, several = false) {
            if (several) {
                var found = [];
            } else {
                var found = null;
            }
            var startDate = new moment(new Date(start));
            availabilitiesOrTimeSlotsOrAssignments.forEach(thing => {
                //we only take the first matching timeSlot, le css ne sait aps encore gerer deux data timeSlot sur un meme calendar timeSlot
                if (startDate.isSame(new moment(new Date(thing.start)))) {
                    if (several) {
                        found.push(thing)
                    } else {
                        found = thing;
                        return false;
                    }
                }
            });
            return found;
        }


    }

AvailabilityService =
    class AvailabilityService {

        static getSurroundingAvailability(user, start, end) {
            console.info("AvailabilityService.getAvailability start:", start, "end", end, "for user", user);
            var found;
            var start = new moment(start);
            if (typeof end === "undefined") var end = new moment(start);
            else
                var end = new moment(end);
            var end = new moment(end);
            user.availabilities.forEach(availability => {
                var availabilityStart = new moment(availability.start);
                var availabilityEnd = new moment(availability.end);
                if (( availabilityStart.isBefore(start) || availabilityStart.isSame(start))
                    && (availabilityEnd.isAfter(end) || availabilityEnd.isSame(end) )) {
                    found = availability;
                    return false;
                }
            });
            return found;
        }

        static getIndexOfSurroundingAvailability(user, start, end) {
            console.info("AvailabilityService.getAvailability start:", start, "end", end, "for user", user);
            var found;
            var start = new moment(start);
            if (typeof end === "undefined") var end = new moment(start);
            else
                var end = new moment(end);
            var end = new moment(end);
            user.availabilities.forEach(function (availability, index, availabilities) {
                var availabilityStart = new moment(availability.start);
                var availabilityEnd = new moment(availability.end);
                if (( availabilityStart.isBefore(start) || availabilityStart.isSame(start))
                    && (availabilityEnd.isAfter(end) || availabilityEnd.isSame(end) )) {
                    found = index;
                    return false;
                }
            });
            return found;
        }

        static removeAvailabilities(user, start, end) {
            console.info("AvailabilityService.splitAvailabilities for user", user, " from", start, "to", end);
            var availabilities = user.availabilities;

            var availabilityIndex = AvailabilityService.getIndexOfSurroundingAvailability(user, start, end);
            //remove old availability
            var availability = availabilities.splice(availabilityIndex, 1)[0];
            //add new availabilities and prevent creating a 0minutes availability
            if (!new moment(availability.start).isSame(new moment(start)))
                availabilities.push({
                    start: availability.start,
                    end: start
                });
            if (!new moment(end).isSame(new moment(availability.end)))
                availabilities.push({
                    start: end,
                    end: availability.end
                });

            Users.update({_id: user._id}, {$set: {availabilities: availabilities}});

        }

        static getIndexOfAvailabilityWhichEndWhenParamStart(user, start) {
            console.info("AvailabilityService.getIndexOfAvailabilityWhichEndWhenParamStart start:", start, "for user", user);
            var found;
            var start = new moment(start);

            user.availabilities.forEach(function (availability, index, availabilities) {
                var availabilityEnd = new moment(availability.end);
                if (availabilityEnd.isSame(start)) {
                    found = index;
                    return false;
                }
            });
            return found;
        }

        static getIndexOfAvailabilityWhichStartWhenParamEnd(user, end) {
            console.info("AvailabilityService.getIndexOfAvailabilityWhichStartWhenParamEnd end:", end, "for user", user);
            var found;
            var end = new moment(end);

            user.availabilities.forEach(function (availability, index, availabilities) {
                var availabilityStart = new moment(availability.start);
                if (availabilityStart.isSame(end)) {
                    found = index;
                    return false;
                }
            });
            return found;
        }

        static restoreAvailabilities(user, start, end) {
            console.info("AvailabilityService.restoreAvailabilities for user", user, " from", start, "to", end);
            var availabilities = user.availabilities;
            var previousAvailability, nextAvailability;

            //if exits, get direct previous availabilty
            var previousAvailabilityIndex = AvailabilityService.getIndexOfAvailabilityWhichEndWhenParamStart(user, start);

            //if exits, get direct next availabilty
            var nextAvailabilityIndex = AvailabilityService.getIndexOfAvailabilityWhichStartWhenParamEnd(user, end);


            //if possible

            //remove old availability(ies)
            if (previousAvailabilityIndex) {
                previousAvailability = availabilities.splice(previousAvailabilityIndex, 1)[0];
            }
            if (nextAvailabilityIndex) {
                nextAvailability = availabilities.splice(nextAvailabilityIndex, 1)[0];
            }

            var newAvailability = {};

            //merge availability
            if (previousAvailability) {
                newAvailability.start = previousAvailability.start;
            } else {
                newAvailability.start = start;
            }
            if (nextAvailability) {
                nextAvailability.end = nextAvailability.end;
            } else {
                newAvailability.end = end;
            }

            Users.update({_id: user._id}, {$set: {availabilities: availabilities}});

        }

        static getAvailabilityByStart(availabilities, start) {
            return TimeSlotService.getTimeSlotByStart(availabilities, start);
        }

        static checkUserAvailabilty(user, start, end) {
            console.info("AvailabilityService.checkUserAvailabilty for user", user, " from", start, "to", end);
            var availabilities = user.availabilities;

            var availabilityIndex = AvailabilityService.getIndexOfSurroundingAvailability(user, start, end);

            if (availabilityIndex == null) {
                return false;
            }
            return true;


        }
    }

PeopleNeedService =
    class PeopleNeedService {

        static getPeopleNeedIndex(timeSlot, peopleNeedHunter) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                console.log(arguments);
                if (peopleNeed._id === peopleNeedHunter._id) {
                    found = index;
                }
            });
            return found;


        }


        static removePeopleNeed(task, timeSlot, peopleNeed, userId) {
            console.info("PeopleNeedService.removePeopleNeed for task", task, "when", timeSlot, "and need", peopleNeed);
            //we have the task
            var timeSlots = task.timeSlots; //all its timeslots
            //var peopleNeeded = timeSlot.peopleNeeded; //all its peopleNeed


            var updatedTimeslot = timeSlot;

            //attention a ne pas pas perdre les poineteurs de tableau et du conteu des tableaux


            var timeSlotToUpdateIndex = TimeSlotService.getTimeSlotIndex(task, timeSlot._id);
            var timeSlotToUpdate = timeSlots[timeSlotToUpdateIndex];
            var peopleNeedToRemoveIndex = PeopleNeedService.getPeopleNeedIndex(timeSlotToUpdate, peopleNeed);
            //remove peopleNeed assigned
            timeSlotToUpdate.peopleNeeded.splice(peopleNeedToRemoveIndex, 1);

            //store assigned user
            peopleNeed.assignedUserId = userId;
            timeSlotToUpdate.peopleNeededAssigned.push(peopleNeed);


            Tasks.update({_id: task._id}, {$set: {timeSlots: timeSlots}});

        }

        static checkPeopleNeedForUser(task, timeSlot, peopleNeed, user) {
            console.info("PeopleNeedService.checkPeopleNeed for task", task, "when", timeSlot, "and need", peopleNeed, "for user", user);


            if (peopleNeed.userId) {
                if (peopleNeed.userId === user._id) {
                    return true;
                } else {
                    return false;
                }
            } else if (peopleNeed.teamId) {

                if (!_.contains(user.teams, peopleNeed.teamId)) {
                    return false;
                }
            }
            if (peopleNeed.skills.length == 0) return true;

            var userHasAllSkills = true;
            _.each(peopleNeed.skills, (skill) => {
                if (!_.contains(user.skills, skill)) {
                    userHasAllSkills = false;
                }
            });
            return userHasAllSkills;
        }

        static getPeopleNeedById(timeSlot, _id) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                console.log(arguments);
                if (peopleNeed._id === _id) {
                    found = peopleNeed;
                }
            });
            return found;
        }
    }


AssignmentService =
    class AssignmentService {

        static getTimeSlot(task, timeSlotId) {
            for (var timeSlot in task.timeSlots) {
                if (timeSlot._id === timeSlotId) {
                    return timeSlot;
                }
            }
            return null;
        }

        static getAssignmentByStart(assignment, start, several) {
            return TimeSlotService.getTimeSlotByStart(assignment, start, several);
        }
    }