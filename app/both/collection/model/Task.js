import {Schemas} from "./SchemasHelpers";
import {TimeSlotService} from "../../../both/service/TimeSlotService";
import {PeopleNeedService} from "../../../both/service/PeopleNeedService";
import {ValidationService} from "../../../both/service/ValidationService";
import "/both/collection/model/T-Validation.js";

//order matters !

Schemas.SkillsId = new SimpleSchema({
  skillsId: {
    type: SimpleSchema.RegEx.Id,
    label: "People Need Skills",
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allSkillsOptions
      }
    }
  }

});

Schemas.PeopleNeed = new SimpleSchema({
  userId: {
    type: String,
    label: "People Need User",
    defaultValue: null,
    optional: true,
    custom: function () {
      var cantUpdate = PeopleNeedService.schemaCustomPeopleNeed(this);
      if (cantUpdate) return cantUpdate;

      if (this.value) {
        if (!Meteor.users.findOne(this.value))
          return "unknownId";

        //one people need user id per timeslot
        if (this.isUpdate) {
          var task = Tasks.findOne(this.docId);
          var timeSlotIndex = this.key.split(".")[1];
          var timeSlot = task.timeSlots[timeSlotIndex];

          if (Tasks.find({
              "_id": task._id,
              "timeSlots._id": timeSlot._id,
              "timeSlots.$.peopleNeeded.userId": this.value
            }).fetch().length !== 0) {
            return "onePeopleNeedUserIdPerTimeSlot"
          }

          //one people need user id per hour
          //overlapp (StartA <= EndB) and (EndA >= StartB)
          if (Tasks.find({
                "timeSlots": {
                  $elemMatch: {
                    "peopleNeeded.userId": this.value,
                    start: {$lt: timeSlot.end},
                    end: {$gt: timeSlot.start}
                  }
                }
              }
            ).fetch().length !== 0) {
            if (Meteor.isClient)
              return "onePeopleNeedUserIdPerDateTimeCODE"
            return "onePeopleNeedUserIdPerDateTime"
          }
        }
      }

      if (this.value === null &&
        ( this.field(this.key.replace("userId", "skills")).value.length === 0 || !this.field(this.key.replace("userId", "skills")).isSet) &&
        ( this.field(this.key.replace("userId", "teamId")).value === null || !this.field(this.key.replace("userId", "teamId")).isSet))
        return "peopleNeedIsEmpty"
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allUsersOptions
      }
    }
  },
  teamId: {
    type: SimpleSchema.RegEx.Id,
    label: "People Need Team",
    optional: true,
    custom: function () {
      var cantUpdate = PeopleNeedService.schemaCustomPeopleNeed(this);
      if (cantUpdate) return cantUpdate;

      if (!this.value) return 1;//autoValue already dit its job
      if (!Teams.findOne(this.value))
        return "unknownId";
      if (this.value !== null && this.field(this.key.replace("teamId", "userId")).isSet && this.field(this.key.replace("teamId", "userId")).value !== null) { //if userId is set
        return "peopleNeedUserId";
      }
      if (this.value === null &&
        ( this.field(this.key.replace("teamId", "skills")).value.length === 0 || !this.field(this.key.replace("teamId", "skills")).isSet) &&
        ( this.field(this.key.replace("teamId", "userId")).value === null || !this.field(this.key.replace("teamId", "userId")).isSet))
        return "peopleNeedIsEmpty"
    },
    autoValue: function () {
      if (!this.isSet)
        return null;
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allTeamsOptions
      }
    }
  },
  skills: {
    label: "People Need Skills",
    type: [SimpleSchema.RegEx.Id],
    optional: true,
    autoValue: function () { //if userId is set, skills is not take into account
      if (!this.isSet)
        return [];
    },
    custom: function () {
      var cantUpdate = PeopleNeedService.schemaCustomPeopleNeed(this);
      if (cantUpdate) return cantUpdate;

      _.each(this.value, function (skill) {
        if (!Skills.findOne(skill._id))
          return "skillsNotFound"
      });
      if (this.value.length !== 0 && this.field(this.key.replace("skills", "userId")).isSet && this.field(this.key.replace("skills", "userId")).value !== null) { //if userId is set
        return "peopleNeedUserId";
      }
      if (this.value.length === 0 &&
        ( this.field(this.key.replace("skills", "teamId")).value === null || !this.field(this.key.replace("skills", "teamId")).isSet) &&
        ( this.field(this.key.replace("skills", "userId")).value === null || !this.field(this.key.replace("skills", "userId")).isSet))
        return "peopleNeedIsEmpty"
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allSkillsOptions
      }
    }
  },
  _id: {
    type: SimpleSchema.RegEx.Id,
    label: "People Need _id",
    autoValue: function () {
      if (!this.isSet)
        return new Meteor.Collection.ObjectID()._str;
    },
    autoform: {
      type: "hidden",
    }
  }
});


Schemas.TimeSlot = new SimpleSchema({
  start: {
    type: Date,
    label: "TimeSlot Start Date",
    custom: function () {
      var cantUpdate = TimeSlotService.schemaCustomTimeSlot(this);
      if (cantUpdate) return cantUpdate;

      var start, end, currentId, timeSlots;

      if (this.isUpdate) {
        var task = Tasks.findOne(this.docId);
        if (this.operator !== "$push") {
          var timeSlotIndex = parseInt(this.key.replace("timeSlots.", "").replace(".start", ""));
          var timeSlot = task.timeSlots[timeSlotIndex];
          currentId = timeSlot._id;
        }
      }

      if (!this.field("timeSlots").isSet || this.field("timeSlots").operator === "$push") {
        timeSlots = task.timeSlots;
      } else
        timeSlots = this.field("timeSlots").value;


      if (!this.field(this.key.replace("start", "") + 'end').isSet) {
        end = new moment(timeSlot.end);
      } else
        end = new moment(this.field(this.key.replace("start", "") + 'end').value);


      if (!currentId)
        currentId = this.field(this.key.replace("start", "") + '_id').value;

      start = new moment(this.value);

      if (start.isAfter(end)) {
        return "startAfterEnd";
      }

      if (!TimeSlotService.areTimeSlotOverlappingWithQuery(timeSlots, start, end, currentId))
        return "timeSlotConflictDate";

      var term = TimeSlotService.timeSlotWithinAssignmentTerm(start, end);
      if (!term) return "timeSlotNotWithinTerms";

      if (term.isStrictMode) {
        var accuracy = term.calendarAccuracy;
        var diff = start.diff(end, "minute");
        if (diff % (accuracy * 60) !== 0) {
          return "timeSlotTermAccuracyError"
        }
      }
    },
    autoform: {
      type: "datetime-local",
    }
  },
  end: {
    type: Date,
    label: " TimeSlot End Date",
    custom: function () {
      var cantUpdate = TimeSlotService.schemaCustomTimeSlot(this);
      if (cantUpdate) return cantUpdate;

      var start, end, currentId, timeSlots;

      if (this.isUpdate) {
        var task = Tasks.findOne(this.docId);
        if (this.operator !== "$push") {
          var timeSlotIndex = parseInt(this.key.replace("timeSlots.", "").replace(".end", ""));
          var timeSlot = task.timeSlots[timeSlotIndex];
          currentId = timeSlot._id;
        }
      }

      if (!this.field("timeSlots").isSet || this.field("timeSlots").operator === "$push") {
        timeSlots = task.timeSlots;
      } else
        timeSlots = this.field("timeSlots").value;


      if (!this.field(this.key.replace("end", "") + 'start').isSet) {
        start = new moment(timeSlot.start);
      } else
        start = new moment(this.field(this.key.replace("end", "") + 'start').value);


      if (!currentId)
        currentId = this.field(this.key.replace("end", "") + '_id').value;

      end = new moment(this.value);

      if (end.isBefore(start)) {
        return "endBeforeStart";
      }

      if (!TimeSlotService.areTimeSlotOverlappingWithQuery(timeSlots, start, end, currentId))
        return "timeSlotConflictDate";

      var term = TimeSlotService.timeSlotWithinAssignmentTerm(start, end);
      if (!term) return "timeSlotNotInAnyTerm";

      if (term.isStrictMode) {
        var accuracy = term.calendarAccuracy;
        var diff = start.diff(end, "minute");
        if (diff % (accuracy * 60) !== 0) {
          return "timeSlotTermAccuracyError"
        }
      }
    },
    autoform: {
      type: "datetime-local",
    }
  },
  peopleNeeded: {
    type: [Schemas.PeopleNeed],
    label: "TimeSlot People needs",
    defaultValue: [],
    custom() {
      return PeopleNeedService.schemaCustomPeopleNeed(this);
    }

  },
  _id: {
    type: SimpleSchema.RegEx.Id,
    label: "TimeSlot _id",
    autoValue: function () {
      if (!this.isSet)
        return new Meteor.Collection.ObjectID()._str;
    },
    autoform: {
      type: "hidden",
    }
    // denyUpdate: true
  }
});

Schemas.Tasks = new SimpleSchema({
  name: {
    type: String,
    label: "Task Name",
    max: 100
  },
  description: {
    type: String,
    label: "Task Description",
    optional: true
  },
  teamId: {
    type: SimpleSchema.RegEx.Id,
    label: "Task Team",
    custom: function () {
      if (!Teams.findOne(this.value))
        return "unknownId";
      return 1
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allTeamsOptions
      }
    }
  },
  activityId: {
    type: SimpleSchema.RegEx.Id,
    label: "Linked Activity",
    optional: true,
    autoValue: function () {
      if (!this.isSet)
        return null;
    },
    custom: function () {
      if (this.value)
        if (!Activities.findOne(this.value))
          return "unknownId";
      return 1;
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allActivitiesOptions
      }
    }
  },
  groupId: {
    type: SimpleSchema.RegEx.Id,
    label: "Task Group",
    optional: true,
    custom: function () {
      if (this.isUpdate)
        if (this.value !== null && !TaskGroups.findOne(this.value)) return "unknownId"
      return 1
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allTaskGroupsOptions
      }
    },
    defaultValue: null
  },
  placeId: {
    type: SimpleSchema.RegEx.Id,
    label: "Task Place",
    custom: function () {
      if (!Places.findOne(this.value))
        return "unknownId";
      return 1
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allPlacesOptions
      }
    }

  },
  liveEventMasterId: {
    type: SimpleSchema.RegEx.Id,
    label: "Task Live event responsible",
    custom: function () {
      if (!Meteor.users.findOne(this.value))
        return "unknownId";
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allUsersOptions
      }
    }
  },
  masterId: {
    type: SimpleSchema.RegEx.Id,
    label: "Task responsible",
    custom: function () {
      if (!Meteor.users.findOne(this.value))
        return "unknownId";
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allUsersOptions
      }
    }
  },
  timeSlots: {
    type: [Schemas.TimeSlot],
    label: "Task Time slots",
    defaultValue: [],
    optional: true,
    custom() {
      return TimeSlotService.schemaCustomTimeSlot(this);
    }
  },
  timeSlotValidation: {
    type: Schemas.Validation,
    label: "Task Time slots validation",
    defaultValue: function () {
      Schemas.Validation.clean({})
    }(),
    optional: true,
    autoform: {
      type: "hidden",
    }
  },
  accessPassValidation: {
    type: Schemas.Validation,
    label: "Task access pass validation",
    defaultValue: function () {
      Schemas.Validation.clean({})
    }(),
    optional: true,
    autoform: {
      type: "hidden",
    }
  },
  equipmentValidation: {
    type: Schemas.Validation,
    label: "Task equipments validation",
    defaultValue: function () {
      Schemas.Validation.clean({})
    }(),
    optional: true,
    autoform: {
      type: "hidden",
    }
  },
  equipments: {
    label: "Task equipments",
    type: [Schemas.EquipmentAsked],
    custom() {
      if (this.isUpdate) {
        var task = Tasks.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(task.equipmentValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        //initialize all equipment to 0 quantity
        return _.map(Equipments.find({targetUsage: {$in: [EquipementTargetUsage.BOTH, EquipementTargetUsage.TASK]}}).fetch(), function (item) {
          return {equipmentId: item._id, quantity: 0};
        })
      }
    }
  },
  powerSupplyId: {
    label: "Task power supply",
    type: SimpleSchema.RegEx.Id,
    optional: true,
    defaultValue: null,
    custom() {
      if (this.isUpdate) {
        if (this.value !== null && !PowerSupplies.findOne(this.value)) return "unknownId"
        var task = Tasks.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(task.equipmentValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allPowerSuppliesOptions
      }
    }
  },
  equipmentStorageId: {
    label: "Task equipment storage",
    type: SimpleSchema.RegEx.Id,
    optional: true,
    defaultValue: null,
    custom() {
      if (this.isUpdate) {
        if (this.value !== null && !EquipmentStorages.findOne(this.value)) return "unknownId"
        var task = Tasks.findOne(this.docId);
        if (!ValidationService.isUpdateAllowed(task.equipmentValidation.currentState)) {
          return "updateNotAllowed"
        }
      }
    },
    autoform: {
      afFieldInput: {
        options: Schemas.helpers.allEquipmentStoragesOptions
      }
    }

  }
});

