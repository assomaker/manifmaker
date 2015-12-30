TimeSlotService =
    class TimeSlotService {
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
    }
