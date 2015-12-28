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