AssignmentService =
    class AssignmentService {

        /**
         * @memberOf AssignmentService
         * @summary Get time slot by _id from a task
         * @locus Anywhere
         * @param task
         * @param timeSlotId
         * @returns {timeSlot|null}
         */
        static getTimeSlot(task, timeSlotId) {
            for (var timeSlot in task.timeSlots) {
                if (timeSlot._id === timeSlotId) {
                    return timeSlot;
                }
            }
            return null;
        }

        /**
         * @memberOf AssignmentService
         * @summary Proxy for TimeSlotService.getTimeSlotByStart
         * @locus Anywhere
         * @param assignment
         * @param start
         * @param several
         * @returns {timeSlot|null}
         */
        static getAssignmentByStart(assignment, start, several) {
            return TimeSlotService.getTimeSlotByStart(assignment, start, several);
        }

        /**
         * @memberOf AssignmentService
         * @summary Filter user list in task to user mode only remove assignment only.
         * Reactive Var :
         *  - Get ReactiveVar SelectedPeopleNeed
         *  - Set SelectedTimeSlot
         *  - Set IsUnassignment
         * @locus Anywhere
         * @returns {timeSlot|null}
         */
        static taskToUserPerformUserFilterRemoveAssignment() {
            var currentAssignmentType = CurrentAssignmentType.get();

            switch (currentAssignmentType) {
                case AssignmentType.USERTOTASK:
                    console.error("Template.assignmentCalendar.events.dblclick .creneau", "User can't normally dlb click on this kind of element when in userToTask");
                    return;
                    break;
                case AssignmentType.TASKTOUSER:
                    var peopleNeeded = SelectedPeopleNeed.get();

                    var assignment = Assignments.findOne({
                        peopleNeedId: peopleNeeded._id
                    });

                    var newFilter = {
                        _id: assignment.userId
                    };

                    SelectedTimeSlot.set(TimeSlotService.getTaskAndTimeSlotAndAssignedPeopleNeedByAssignedPeopleNeedId(peopleNeeded._id).timeSlot);
                    UserFilter.set(newFilter);
                    IsUnassignment.set(true);
                    break;
            }
        }

        /**
         * @memberOf AssignmentService
         * @summary Filter user list in task to user mode only.
         * Reactive Var :
         *  - Get ReactiveVar SelectedPeopleNeed
         *  - Set SelectedTimeSlot
         *  - Set IsUnassignment
         * @locus Anywhere
         * @returns {timeSlot|null}
         */
        static taskToUserPerformUserFilter() {
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
            var peopleNeeded = SelectedPeopleNeed.get();
            var timeSlot = SelectedTimeSlot.get();
            IsUnassignment.set(false);

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
        }

        /**
         * @memberOf AssignmentService
         * @summary Read from popover to perform filter on user list in task to user mode only.
         * Reactive Var :
         *  - Set SelectedPeopleNeed
         *  - Set SelectedTimeSlot
         * @locus Anywhere
         * @returns {timeSlot|null}
         */
        static readSelectedPeopleNeedAndTimeSlotFromPopover(event, isAssigned) {
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



    }