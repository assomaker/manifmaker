import {Schemas} from "./SchemasHelpers";
import {TimeSlotService} from "../../../both/service/TimeSlotService";
import {PeopleNeedService} from "../../../both/service/PeopleNeedService";

//order matters !
Schemas.Assignments = new SimpleSchema({
  userId: {
    type: String,
    label: "Assignments UserId",
    custom: function () {
      if (!Meteor.users.findOne(this.value))
        return "unknownId";
    }
  },
  taskId: {
    type: String,
    label: "Assignments TaskId",
    custom: function () {
      if (!Tasks.findOne(this.value))
        return "unknownId";
      if (Tasks.findOne(this.value).timeSlotValidation.currentState !== ValidationState.READY)
        return "updateNotAllowed"
    }
  },
  timeSlotId: {
    type: String,
    label: "Assignments TimeSlotId",
    custom: function () {
      var task = Tasks.findOne(this.field('taskId').value);
      var found = TimeSlotService.getTimeSlot(task, this.value);
      if (!found)
        return "unknownId";
    },

  },
  peopleNeedId: {
    type: String,
    label: "Assignments PeopleNeedId",
    custom: function () {
      var task = Tasks.findOne(this.field('taskId').value);
      var found = TimeSlotService.getTimeSlot(task, this.field('timeSlotId').value);
      if (!found)
        return "unknownId";
      var peopleNeed = PeopleNeedService.getPeopleNeedById(found, this.value);
      if (!peopleNeed)
        return "unknownId";
    },

  }
});