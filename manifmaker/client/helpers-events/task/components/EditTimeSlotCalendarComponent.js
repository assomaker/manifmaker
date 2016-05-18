import {BaseCalendarComponent} from "../../common/BaseCalendarComponent"
import {AssignmentService} from "../../../../both/service/AssignmentService"
import {TimeSlotService} from "../../../../both/service/TimeSlotService"

class EditTimeSlotCalendarComponent extends BaseCalendarComponent {
    /* available in data
     this.data().parentInstance

     */

    peopleNeedOnClick() {
        //to implement
    }

    peopleNeedAssignedOnClick(event) {
        //to implement
    }

    creanOnClick(e) {
        //to implement
        var _id = $(e.currentTarget).data("timeslotdid");
        this.data().parentInstance.updatedTimeSlotId.set(_id);
        this.data().parentInstance.isTimeSlotUpdated.set(true);
    }

    quartHeureOnClick(event) {
        //to implement
    }


    timeSlot(date, timeHours, idTask) {
        var startCalendarTimeSlot = this.getCalendarDateTime(date, timeHours);

        var data = {};

        var task = this.data().task;
        if (!task) return [];

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

        _.extend(data, founded);
        var end = new moment(founded.end);
        var start = new moment(founded.start);
        var duration = end.diff(start) / (3600 * 1000);

        var height = accuracy * baseOneHourHeight * duration;
        data.height = height + "px";


        return [data];  //le css ne sait pas encore gerer deux data timeSlot sur un meme calendar timeSlot
    }

    getPeopleNeededMerged(timeSlotId){
        return this.data().parentInstance.getPeopleNeededMerged(timeSlotId);
    }
}

EditTimeSlotCalendarComponent.register("EditTimeSlotCalendarComponent");