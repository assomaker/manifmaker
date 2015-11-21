TimeSlotService =
class TimeSlotService {
    static read(timeSlot) {
        return new TimeSlot(timeSlot.start, timeSlot.end, timeSlot.peopleNeeded, timeSlot._id);
    }

    static getTimeSlot(task, timeSlotId) {
        console.info("TimeSlotService.getTimeSlot timeSlot", timeSlotId, "for task", task);
        var found;
        task.timeSlots.forEach(timeSlot => {
            if (timeSlot._id === timeSlotId) {
                found = TimeSlotService.read(timeSlot);
                return false;
            }
        });
        return found;
    }
}

AvailabilityService =
class AvailabilityService {
    static read(availability) {
        return new Availability(availability.start, availability.end);
    }

    static getAvailability(user, start, end) {
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
                found = AvailabilityService.read(availability);
                return false;
            }
        });
        return found;
    }
}


AssignmentService =
class AssignmentService {
    static read(assigment) {
        return new Assignment(assigment.userId, assigment.taskId, assigment.timeSlotId, assigment._id);
    }

    static getTimeSlot(task, timeSlotId) {
        for (var timeSlot in task.timeSlots) {
            if (timeSlot._id === timeSlotId) {
                return new TimeSlot();
            }
        }
        return null;
    }
}