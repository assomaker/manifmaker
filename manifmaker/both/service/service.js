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
                found =  TimeSlotService.read(timeSlot);
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