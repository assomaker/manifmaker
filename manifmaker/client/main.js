defaultFilter = {};
noSearchFilter = "";
noneFilter = {none: "none"};
UserFilter = new ReactiveVar(defaultFilter);
SelectedUser = new ReactiveVar(null);
TaskFilter = new ReactiveVar(defaultFilter);
TaskIndexFilter = new ReactiveVar(noSearchFilter);
UserIndexFilter = new ReactiveVar(noSearchFilter);
UserTeamFilter = new ReactiveVar(defaultFilter);
TaskTeamFilter = new ReactiveVar(defaultFilter);
TaskNeededTeamFilter = new ReactiveVar(null);
TaskSkillsFilter = new ReactiveVar(null);
UserSkillsFilter = new ReactiveVar(defaultFilter);
SelectedTask = new ReactiveVar(null);
SelectedTaskBreadCrumb = new ReactiveVar(null); //TODO voir si on peut la merger avec SelectedTask
SelectedTimeSlot = new ReactiveVar(null);
SelectedDate = new ReactiveVar(null);

SelectedAvailability = new ReactiveVar(null);
SelectedPeopleNeed = new ReactiveVar(null);

AssignmentFilter = new ReactiveVar(defaultFilter);
CurrentAssignmentType = new ReactiveVar(AssignmentType.ALL);
IsUnassignment = new ReactiveVar(false);

TaskListTeamFilter = new ReactiveVar(defaultFilter);


function preSelecterTaskByTaskName(name) {
    UserFilter.set(noneFilter);
    TaskFilter.set(defaultFilter);
    CurrentAssignmentType.set(AssignmentType.TASKTOUSER);

    var query = Tasks.find({name: name});
    var handle = query.observeChanges({
        added: function (_id, task) {
            SelectedTask.set({_id: _id});
            UserFilter.set(noneFilter);
        }
    });

}


function preSelectedUserByUserName(name) {
    UserFilter.set(defaultFilter);
    TaskFilter.set(noneFilter);
    CurrentAssignmentType.set(AssignmentType.USERTOTASK);

    var query = Users.find({name: name});
    var handle = query.observeChanges({
        added: function (_id, task) {
            SelectedUser.set({_id: _id});
            SelectedAvailability.set(null);
            TaskFilter.set(noneFilter);
        }
    });

}

function readSelectedPeopleNeedAndTimeSlotFromPopover(event, isAssigned) {
    var target = $(event.target);

    var peopleNeedId;
    if (target.data('_id')) {
        peopleNeedId = target.data('_id');
    } else {
        peopleNeedId = $(target.parents(".peopleNeed")).data('_id');
    }

    var task, ret;
    if(isAssigned){
        task = Tasks.findOne({
            timeSlots: {
                $elemMatch: {
                    peopleNeededAssigned: {
                        $elemMatch: {
                            _id: peopleNeedId
                        }
                    },
                }
            }
        });
        ret = PeopleNeedService.getAssignedPeopleNeedByIdAndTask(peopleNeedId, task);
    } else {
        task = Tasks.findOne({
            timeSlots: {
                $elemMatch: {
                    peopleNeeded: {
                        $elemMatch: {
                            _id: peopleNeedId
                        }
                    },
                }
            }
        });
        ret = PeopleNeedService.getPeopleNeedByIdAndTask(peopleNeedId, task);
    }

    var peopleNeeded = ret.peopleNeed;
    var timeSlot = TimeSlotService.getTimeSlot(task, ret.timeSlotId);
    SelectedPeopleNeed.set(peopleNeeded);
    SelectedTimeSlot.set(timeSlot);
}
Meteor.startup(function () {
    Meteor.subscribe("skills");
    Meteor.subscribe("users");
    Meteor.subscribe("tasks");
    Meteor.subscribe("places");
    Meteor.subscribe("assignments");
    Meteor.subscribe("teams");
    Meteor.subscribe("groups");
    Meteor.subscribe("assignment-terms", function () {
        AssignmentServiceClient.setCalendarTerms();
    });


    //preSelecterTaskByTaskName("task1");
    //preSelectedUserByUserName("user1");

    SimpleSchema.debug = true;
    AutoForm.addHooks(null, {
        onError: function (name, error, template) {
            console.log(name + " error:", error);
        }
    });

    var accuracy = CalendarAccuracyEnum["1"];
    AssignmentServiceClient.setCalendarAccuracy(accuracy);


    //TODO mettre ca ailleurs
    var originalLeave = $.fn.popover.Constructor.prototype.leave;
    $.fn.popover.Constructor.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
        var container, timeout;

        originalLeave.call(this, obj);

        if (obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover')
            timeout = self.timeout;
            container.one('mouseenter', function () {
                //We entered the actual popover – call off the dogs
                clearTimeout(timeout);
                //Let's monitor popover content instead
                container.one('mouseleave', function () {
                    $.fn.popover.Constructor.prototype.leave.call(self, self);
                });
            })
        }
    };

    //TODO mettre ca ailleurs
    $('body').popover({html: true, selector: '[data-popover]', trigger: 'click hover', placement: 'auto', delay: {show: 50, hide: 400}});

    //TODO mettre ca ailleurs
    $(document).on("click", ".popover .peopleNeed.assigned", function (event) {
        readSelectedPeopleNeedAndTimeSlotFromPopover(event, true);

        taskToUserPerformUserFilterRemoveAssignment();

    });

    //TODO mettre ca ailleurs
    $(document).on("click", ".popover .peopleNeed:not(.assigned)", function (event) {
        readSelectedPeopleNeedAndTimeSlotFromPopover(event, false);

        taskToUserPerformUserFilter();
    })


});

