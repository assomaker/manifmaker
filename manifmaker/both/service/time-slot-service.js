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


    }
