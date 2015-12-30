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
SelectedTimeSlot = new ReactiveVar(null);
SelectedDate = new ReactiveVar(null);

selectedTimeslotId = null; //TODO mettre ca dans Session ?//TODO pas top
selectedAvailability = null;//TODO pas top

AssignmentFilter = new ReactiveVar(defaultFilter);
CurrentAssignmentType = new ReactiveVar(AssignmentType.ALL);
IsUnassignment = new ReactiveVar(false);


function preSelecterTaskByTaskName(name) {
    UserFilter.set(noneFilter);
    TaskFilter.set(defaultFilter);
    CurrentAssignmentType.set(AssignmentType.TASKTOUSER);

    var query = Tasks.find({name: name});
    var handle = query.observeChanges({
        added: function (_id, task) {
            SelectedTask.set({_id: _id});
            selectedTimeslotId = null;//TODO pas top
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
            selectedAvailability = null;//TODO pas top
            TaskFilter.set(noneFilter);
        }
    });

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


    var originalLeave = $.fn.popover.Constructor.prototype.leave;
    $.fn.popover.Constructor.prototype.leave = function(obj){
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
        var container, timeout;

        originalLeave.call(this, obj);

        if(obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover')
            timeout = self.timeout;
            container.one('mouseenter', function(){
                //We entered the actual popover – call off the dogs
                clearTimeout(timeout);
                //Let's monitor popover content instead
                container.one('mouseleave', function(){
                    $.fn.popover.Constructor.prototype.leave.call(self, self);
                });
            })
        }
    };


    $('body').popover({ html:true, selector: '[data-popover]', trigger: 'click hover', placement: 'auto', delay: {show: 50, hide: 400}});

    $(document).on("click",".peopleNeed",function(event){
        var dom = $($(event.target).parents(".peopleNeed"));
        var peopleNeedId = dom.data('_id');
        var task = Tasks.findOne({
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

        var ret = PeopleNeedService.getPeopleNeedByIdAndTask(peopleNeedId,task);
        var peopleNeeded = ret.peopleNeed;

        var selectedTimeSlot = {
            _id : ret.timeSlotId
        };


        var currentAssignmentType = CurrentAssignmentType.get();

        switch (currentAssignmentType) {
            case AssignmentType.USERTOTASK:
                console.error("Template.assignmentCalendar.events.click .creneau", "User can't normally click on this kind of element when in userToTask");
                return;
                break;
            case AssignmentType.TASKTOUSER: //only display users that have at least one availability matching the selected time slot
                selectedTimeslotId = selectedTimeSlot._id;

                var timeSlot = TimeSlotService.getTimeSlot(task, selectedTimeSlot._id);
                /**
                 *
                 * By now, userId, teamId and skills can't be combined.
                 * In particular we can't ask for a specific team and for specific skills (will be soon)
                 *
                 * Skills filter
                 *
                 * For selected task's time slot, the user must have all the required skills of at least
                 * one of task's people need
                 *
                 */
                var askingSpecificNeedAndSkills = [];
                if (peopleNeeded.userId) { //prior above teamId an skills
                    askingSpecificNeedAndSkills.push({
                        _id: peopleNeeded.userId
                    });
                } else if (peopleNeeded.teamId && peopleNeeded.skills.length !== 0) {  //we combine teamId and skills
                    askingSpecificNeedAndSkills.push({
                        $and: [
                            {
                                teams: peopleNeeded.teamId
                            },
                            {
                                skills: {
                                    $all: peopleNeeded.skills
                                }
                            }
                        ]
                    });
                } else if (peopleNeeded.teamId) { //we only use teamId
                    askingSpecificNeedAndSkills.push({
                        teams: peopleNeeded.teamId
                    });
                } else if (peopleNeeded.skills.length !== 0) //if people need doesn't require any particular skills
                    askingSpecificNeedAndSkills.push({skills: {$all: peopleNeeded.skills}});

                var userTeamsSkillsFilter;
                if (askingSpecificNeedAndSkills.length !== 0) //if all time slot's people need don't require any particular skills
                    userTeamsSkillsFilter = {
                        $or: askingSpecificNeedAndSkills
                    };


                var availabilitiesFilter = {
                    availabilities: {
                        $elemMatch: {
                            start: {$lte: timeSlot.start},
                            end: {$gte: timeSlot.end}
                        }
                    }
                };

                /**
                 * The user must be free during the time slot duration and have skills that match the required ones
                 */
                var newFilter = {
                    $and: [
                        availabilitiesFilter,
                        userTeamsSkillsFilter
                    ]
                };
                console.info("TASKTOUSER user filter", newFilter);


                UserFilter.set(newFilter);
                break;
        }




    })



});

