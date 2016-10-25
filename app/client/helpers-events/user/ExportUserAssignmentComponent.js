import {TimeSlotService} from "../../../both/service/TimeSlotService"

class ExportUserAssignmentComponent extends BlazeComponent {

    constructor() {
        super();
    }

    template() {
        return "exportUserAssignmentComponent";
    }

    sortedAssignments(){
        return _.sortBy(Assignments.find({userId: this.data()._id}).fetch(), function(assigment){
           return TimeSlotService.getTimeSlot(Tasks.findOne(assigment.taskId), assigment.timeSlotId).start
        });
    }

    task(){
        return Tasks.findOne(this.currentData().taskId)
    }

    timeSlot(){
        return TimeSlotService.getTimeSlot(this.task(), this.currentData().timeSlotId)
    }

    displayAssignedUser(userId){
        var user = Users.findOne(userId);
        return user.name + "(066666)"
    }

}

ExportUserAssignmentComponent.register('ExportUserAssignmentComponent');
