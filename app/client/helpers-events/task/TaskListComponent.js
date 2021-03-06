import {TeamService} from "../../../both/service/TeamService"
import {Utils} from "../../../client/service/Utils"

export class TaskListComponent extends BlazeComponent {
  constructor() {
    super();
    this.taskListAdvancedSearch = new ReactiveVar(false);
    this.isAfterFilterOn = new ReactiveVar(false);
    this.isBeforeFilterOn = new ReactiveVar(false);
  }

  template() {
    return "taskListComponent";
  }

  events() {
    return [{
      "keyup #search_task_name": this.filterName,
      "click #advanced-search-button": this.switchAdvanced,
      "click #checkbox-after-filter": this.switchAfterFilter,
      "click #checkbox-before-filter": this.switchBeforeFilter,
    }];
  }

  /**
   * Switch between hiding and showing the advanced search menu
   * @param event
   */
  switchAdvanced(event) {
    this.taskListAdvancedSearch.set(!this.isSearchAdvanced());
  }

  isSearchAdvanced() {
    return this.taskListAdvancedSearch.get();
  }

  filterTeam(error, docModified, newOption) {
    return _.bind(function (error, docModifier, newOption) {
      var _id = newOption;
      this.taskListTeamFilter.set(_id);
    }, this);
  }

  filterResponsible(error, docModifier, newOption) {
    return _.bind(function (error, docModifier, newOption) {
      var _id = newOption;
      this.taskListResponsibleFilter.set(_id);
    }, this);
  }

  filterValidationStatus(error, docModifier, newOption) {
    return _.bind(function (error, docModifier, validationOption) {
      var queryTimeSlot = "", queryEquipment = "";
      if (validationOption) {
        var validationRole = validationOption.split("_")[0];
        var validationStatus = validationOption.split("_")[1];

        if (validationRole === RolesEnum.EQUIPMENTVALIDATION) {
          queryEquipment = validationStatus;
        } else if (validationRole === RolesEnum.ASSIGNMENTVALIDATION) {
          queryTimeSlot = validationStatus;
        } else if (validationRole === "ALL") {
          //TODO
          queryEquipment = validationStatus;
          queryTimeSlot = validationStatus;
        }
      }

      this.taskListTimeSlotValidationStateFilter.set(queryTimeSlot);
      this.taskListEquipmentValidationStateFilter.set(queryEquipment);
    }, this);
  }

  optionQueryTeamsWithoutAlreadyAssigned() {
    return TeamService.optionQueryTeamsWithoutAlreadyAssigned();
  }

  optionValidationStatus() {
    /*
     user with at least one validation role :
            for each of its validation role :
                <ROLE>_TOBEVALIDATED
                <ROLE>_REFUSED
     user without any validation role :
        ALL_OPEN
        ALL_TOBEVALIDATED
        ALL_REFUSED
        ALL_READY
     */
    var result = [];
    var validationRoles = [
      Meteor.roles.findOne({name: "ASSIGNMENTVALIDATION"}),
      Meteor.roles.findOne({name: "EQUIPMENTVALIDATION"})
    ];
    var userValidationRole = [];
    validationRoles.forEach(validationRole => {
      if (Roles.userIsInRole(Meteor.userId(), validationRole.name))
        userValidationRole.push(validationRole.name);
    });

    if (userValidationRole.length > 0) {
      validationRoles.forEach(validationRole => {
        result.push({
          label: RolesEnumDisplay[validationRole.name] + " " + ValidationStateDisplay.TOBEVALIDATED,
          value: validationRole.name + "_" + ValidationState.TOBEVALIDATED
        });
        result.push({
          label: RolesEnumDisplay[validationRole.name] + " " + ValidationStateDisplay.REFUSED,
          value: validationRole.name + "_" + ValidationState.REFUSED
        });
      })
    } else {
      result.push({
        label: ValidationStateDisplay.OPEN,
        value: "ALL_" + ValidationState.OPEN
      });
      result.push({
        label: ValidationStateDisplay.TOBEVALIDATED,
        value: "ALL_" + ValidationState.TOBEVALIDATED
      });
      result.push({
        label: ValidationStateDisplay.REFUSED,
        value: "ALL_" + ValidationState.REFUSED
      });
      result.push({
        label: ValidationStateDisplay.READY,
        value: "ALL_" + ValidationState.READY
      });
    }
    return result;
  }

  filterName(event) {
    event.preventDefault();
    var _id = $(event.target).val();
    this.taskListNameFilter.set(_id);
  }

  switchAfterFilter(event) {
    var _id = $(event.target).prop("checked");
    if (_id) {
      this.isAfterFilterOn.set(true);

      var _date = this.$(".date-after-filter>.datetimepicker").data("DateTimePicker").date(); //get the date
      this.changeDateFilter(_date, "after");
    } else {
      this.deleteDateFilter("after");
      this.isAfterFilterOn.set(false);
    }
  }

  isAfterFilterReadOnly() {
    return !this.isAfterFilterOn.get();
  }

  filterAfter(newOption) {
    return _.bind(function (newOption) {
      var _time = new moment(newOption);
      this.changeDateFilter(_time, "after");
    }, this);
  }

  switchBeforeFilter(event) {
    var _id = $(event.target).prop("checked");
    if (_id) {
      this.isBeforeFilterOn.set(true);

      var _date = this.$(".date-before-filter>.datetimepicker").data("DateTimePicker").date(); //get the date
      this.changeDateFilter(_date, "before");
    } else {
      this.deleteDateFilter("before");
      this.isBeforeFilterOn.set(false);
    }
  }

  isBeforeFilterReadOnly() {
    return !this.isBeforeFilterOn.get();
  }

  filterBefore(newOption) {
    return _.bind(function (newOption) {
      var _time = new Date(newOption);
      this.changeDateFilter(_time, "before");
    }, this);
  }

  changeDateFilter(newDate, beforeOrAfter) {
    if (this.taskDateFilter.get()["$elemMatch"]) { //if a filter is already defined
      var dateQuery = this.taskDateFilter.get();
      if (beforeOrAfter == "before") {
        dateQuery["$elemMatch"]["end"] = {"$lte": newDate.toDate()};
      } else if (beforeOrAfter == "after") {
        dateQuery["$elemMatch"]["start"] = {"$gte": newDate.toDate()};
      }
      this.taskDateFilter.set(dateQuery);
    } else {
      if (beforeOrAfter == "before") {
        this.taskDateFilter.set({"$elemMatch": {"end": {"$lte": newDate.toDate()}}});
      } else if (beforeOrAfter == "after") {
        this.taskDateFilter.set({"$elemMatch": {"start": {"$gte": newDate.toDate()}}});
      }
    }
  }

  deleteDateFilter(beforeOrAfter) {
    var paramToChange, otherParam;
    if (beforeOrAfter == "before") {
      paramToChange = "end";
      otherParam = "start";
    } else if (beforeOrAfter == "after") {
      paramToChange = "start";
      otherParam = "end";
    }

    if (this.taskDateFilter.get()["$elemMatch"]) { //if a filter is defined
      if (this.taskDateFilter.get()["$elemMatch"][otherParam]) { //if the other filter is active
        var dateQuery = this.taskDateFilter.get();
        delete dateQuery["$elemMatch"][paramToChange]; //just delete the one we don't want
        this.taskDateFilter.set(dateQuery);
      } else {
        this.taskDateFilter.set("");
      }
    } else {
      this.taskDateFilter.set("");
    }
  }

  onCreated() {
    this.taskListTeamFilter = new ReactiveTable.Filter("task-list-team-filter", ["teamId"]);
    this.taskListResponsibleFilter = new ReactiveTable.Filter("task-list-responsible-filter", ["masterId"]);
    this.taskListNameFilter = new ReactiveTable.Filter('search-task-name-filter', ['name']);
    this.taskListTimeSlotValidationStateFilter = new ReactiveTable.Filter('task-timeslot-validation-state-filter', ['timeSlotValidation.currentState']);
    this.taskListEquipmentValidationStateFilter = new ReactiveTable.Filter('task-equipment-validation-state-filter', ['equipmentValidation.currentState']);
    this.taskDateFilter = new ReactiveTable.Filter("task-date-filter", ["timeSlots"]);

  }

  tasksList() {
    var fields = [
      {
        key: 'name',
        label: 'Name',
        cellClass: 'col-sm-3',
        headerClass: 'col-sm-3',
        fnAdjustColumnSizing: true,
        fn: _.bind(function (value) {
          return Utils.camelize(value);
        }, this)
      },
      // TODO add GROUP
      /*{
       key: 'groupId',
       label: 'Group',
       cellClass: 'col-sm-2',
       headerClass: 'col-sm-2',
       fnAdjustColumnSizing: true,
       searchable: false,
       fn: function (groupId, Task) {
       return Groups.findOne(groupId).name;
       }
       },*/
      {
        key: 'teamId',
        label: 'Team',
        cellClass: 'col-sm-2',
        headerClass: 'col-sm-2',
        fnAdjustColumnSizing: true,
        searchable: false, //TODO doesn't work (try with a teamId)
        fn: function (teamId, Task) {
          return Teams.findOne(teamId).name;
        }
      },
      {
        key: 'timeSlots',
        label: 'Time slots count',
        cellClass: 'col-sm-1 text-center',
        headerClass: 'col-sm-1 text-center',
        searchable: false, //TODO doesn't work (try with a teamId)
        sortable: false,
        fn: function (timeSlots, Task) {
          return timeSlots.length;
        },
        fnAdjustColumnSizing: true
      }
    ];

    this.addExtraColumn(fields);

    fields.push({
      label: 'Actions',
      cellClass: 'col-sm-2 text-center',
      headerClass: 'col-sm-2 text-center',
      sortable: false,
      searchable: false, //TODO doesn't work (try with a teamId)
      tmpl: Template.taskButtons,
      fnAdjustColumnSizing: true
    });

    return {
      collection: Tasks,
      rowsPerPage: Tasks.find().fetch().length,
      showFilter: false,
      showRowCount: true,
      fields: fields,
      filters: [
        'task-list-team-filter',
        'task-list-responsible-filter',
        'search-task-name-filter',
        'task-timeslot-validation-state-filter',
        'task-equipment-validation-state-filter',
        'task-date-filter'
      ]
    }
  }

  addExtraColumn(fields) {
    if (Roles.userIsInRole(Meteor.userId(), RolesEnum.TASKWRITE))
      fields.push({
        label: 'Validation',
        cellClass: 'col-sm-2 text-center',
        headerClass: 'col-sm-2 text-center',
        sortable: false,
        searchable: false, //TODO doesn't work (try with a teamId)
        tmpl: Template.validationStateForTaskList,
        fnAdjustColumnSizing: true
      });
  }

}

TaskListComponent.register("TaskListComponent");