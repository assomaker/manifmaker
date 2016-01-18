TimeSlotService =
    class TimeSlotService {


        /**
         * @memberOf TimeSlotService
         * @summary For a given task, get time slot by _id
         * @locus Anywhere
         * @param task
         * @param timeSlotId
         * @returns {TimeSlot|null}
         */
        static getTimeSlot(task, timeSlotId) {
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

        /**
         * @memberOf TimeSlotService
         * @summary For a given task, get time slot index by _id
         * @locus Anywhere
         * @param task
         * @param timeSlotId
         * @returns {MongoId|null}
         */
        static getTimeSlotIndex(task, timeSlotId) {
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

        /**
         * @memberOf TimeSlotService
         * @summary Get one (several = false) or an array (several = true) of all item of availabilitiesOrTimeSlotsOrAssignments that start date is the same as start param
         * @locus Anywhere
         * @param availabilitiesOrTimeSlotsOrAssignments {Array<Availability|TimeSlot|Assignment>}
         * @param start {Date}
         * @param several {boolean = false}
         * @returns {Array<?> or ? |*}
         */
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


        /**
         * @memberOf TimeSlotService
         * @summary Get time slot by _id over all the Tasks (not very effective)
         * @locus Anywhere
         * @param timeSlotId {MondoId}
         * @returns {{timeSlot: *, task: *}}
         */
        static getTimeSlotById(timeSlotId) {
            var found;
            var taskFound;
            Tasks.find().fetch().forEach(task => {
                task.timeSlots.forEach(timeSlot => {
                    if (timeSlot._id === timeSlotId) {
                        found = timeSlot;//TimeSlotService.read(timeSlot);
                    }
                });
                if (!taskFound && found)
                    taskFound = task;

            });


            return {
                timeSlot: found,
                task: taskFound
            };
        }

        /**
         * @memberOf TimeSlotService
         * @summary Give a people need _id, looks over all Tasks to find and return people need, time slot and task
         * @locus Anywhere
         * @param peopleNeedId {MondoId}
         * @returns {{timeSlot: <TimeSlot>, task: <Task>, peopleNeed: <PeopleNeed>}}
         */
        static getTaskAndTimeSlotAndPeopleNeedByPeopleNeedId(peopleNeedId) {
            var timeSlotFound;
            var taskFound;
            var peopleNeedFound;
            Tasks.find().fetch().forEach(task => {
               // if (!taskFound)
                    task.timeSlots.forEach(timeSlot => {
                     //   if (!timeSlotFound)
                            timeSlot.peopleNeeded.forEach(peopleNeed => {
                         //       if (!peopleNeed)
                                    if (peopleNeed._id === peopleNeedId) {
                                        peopleNeedFound = peopleNeed;
                                    }
                            });
                        if (!timeSlotFound && peopleNeedFound)
                            timeSlotFound = timeSlot;
                    });
                if (!taskFound && timeSlotFound)
                    taskFound = task;
            });

            return {
                timeSlot: timeSlotFound,
                task: taskFound,
                peopleNeed: peopleNeedFound
            };
        }

        /**
         * @memberOf TimeSlotService
         * @summary Give a people need assigned _id, looks over all Tasks to find and return people need assigned, time slot and task
         * @locus Anywhere
         * @param peopleNeedId {MondoId}
         * @returns {{timeSlot: <TimeSlot>, task: <Task>, peopleNeed: <PeopleNeed>}}
         */
        static getTaskAndTimeSlotAndAssignedPeopleNeedByAssignedPeopleNeedId(peopleNeedId) {
            var timeSlotFound;
            var taskFound;
            var peopleNeedFound;
            Tasks.find().fetch().forEach(task => {
                // if (!taskFound)
                task.timeSlots.forEach(timeSlot => {
                    //   if (!timeSlotFound)
                    timeSlot.peopleNeededAssigned.forEach(peopleNeed => {
                        //       if (!peopleNeed)
                        if (peopleNeed._id === peopleNeedId) {
                            peopleNeedFound = peopleNeed;
                        }
                    });
                    if (!timeSlotFound && peopleNeedFound)
                        timeSlotFound = timeSlot;
                });
                if (!taskFound && timeSlotFound)
                    taskFound = task;
            });

            return {
                timeSlot: timeSlotFound,
                task: taskFound,
                peopleNeed: peopleNeedFound
            };
        }
    }
