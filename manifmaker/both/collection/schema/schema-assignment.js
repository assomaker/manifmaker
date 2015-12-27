//order matters !

Schemas.Assignments = new SimpleSchema({
    userId: {
        type: String,
        label: "Assignments User",
    },
    taskId: {
        type: String,
        label: "Assignments taskId",
    },
    timeSlotId: {
        type: String,
        label: "Assignments timeSlotId",
        custom: function () {
            var task = Tasks.findOne(this.field('taskId').value);
            var found = TimeSlotService.getTimeSlot(task, this.value);
            if (!found)
                return "unknownId";
        },

    },
    peopleNeedId :{
        type: String,
        label: "Assignments peopleNeedId",
        custom: function () {
            var task = Tasks.findOne(this.field('taskId').value);
            var found = TimeSlotService.getTimeSlot(task, this.field('timeSlotId').value);
            if (!found)
                return "unknownId";
            var peopleNeed = PeopleNeedService.getPeopleNeedById(found,this.value);
            if(!peopleNeed)
                return "unknownId";
        },

    }
});