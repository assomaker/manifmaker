AssignmentServiceClient =
    class AssignmentServiceClient {

        /**
         * @memberOf AssignmentServiceClient
         * @summary On the assignment calendar, display more or less hours accuracy
         * @locus client
         * @param accuracy {CalendarAccuracy}
         */
        static setCalendarAccuracy(accuracy) {

            _.each(AssignmentCalendarDisplayedHours.find().fetch(), function (doc) {
                AssignmentCalendarDisplayedHours.remove(doc._id)
            });
            _.each(AssignmentCalendarDisplayedQuarter.find().fetch(), function (doc) {
                AssignmentCalendarDisplayedQuarter.remove(doc._id)
            });
            _.each(AssignmentCalendarDisplayedAccuracy.find().fetch(), function (doc) {
                AssignmentCalendarDisplayedAccuracy.remove(doc._id)
            });

            AssignmentCalendarDisplayedAccuracy.insert({accuracy: accuracy});

            var number = ((accuracy <= 1) ? 1 : accuracy);
            for (var i = 0; i < 24; i = i + number)
                AssignmentCalendarDisplayedHours.insert({date: i});

            var number2 = ((accuracy < 1) ? 60 * accuracy : 60);
            for (var i = 0; i <= 45; i = i + number2)
                AssignmentCalendarDisplayedQuarter.insert({quarter: i});

        }

        /**
         * @memberOf AssignmentServiceClient
         * @summary On the assignment calendar, all the days covered by the given assignment term
         * @locus client
         * @param _idAssignmentTerms {AssignmentTerms}
         */
        static setCalendarTerms(_idTerms) {
            _.each(AssignmentCalendarDisplayedDays.find().fetch(), function (doc) {
                AssignmentCalendarDisplayedDays.remove(doc._id)
            });

            var displayedTerm;
            if(!_idTerms){
                var terms = AssignmentTerms.find({}).fetch();
                displayedTerm = terms[0];           //TODO which is default ?
            } else {
                displayedTerm = AssignmentTerms.findOne(_idTerms)
            }


            var start = new moment(displayedTerm.start);
            var end = new moment(displayedTerm.end);

            while (start.isBefore(end)) {
                AssignmentCalendarDisplayedDays.insert({
                    date: start
                });
                start.add(1,'days');
            }

        }

        /**
         * @memberOf AssignmentServiceClient
         * @summary Init Materialize multiselect HTML component on assignment page
         * @locus client
         */
        static initAssignmentSkillsFilter () {
            //init skills filter for assignment if we are on the assignment page
            $(document).ready(function () {
                $('#filter_skills_user').multiselect({
                    enableFiltering: true,
                    filterPlaceholder: 'Search for skills...',
                    numberDisplayed: 2,
                    nonSelectedText: 'Choose some skills',
                    nSelectedText: ' skills selected'
                });
            });
            $(document).ready(function () {
                $('#filter_skills_task').multiselect({
                    enableFiltering: true,
                    filterPlaceholder: 'Search for skills...',
                    numberDisplayed: 2,
                    nonSelectedText: 'Choose some skills',
                    nSelectedText: ' skills selected'
                });
            });
        }

        /**
         * @memberOf AssignmentServiceClient
         * @summary Init Materialize popover HTML component on assignment page
         * @locus client
         */
        static initAssignmentPopover() {
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

            $('body').popover({html: true, selector: '[data-popover]', trigger: 'click hover', placement: 'auto', delay: {show: 50, hide: 400}});

            $(document).on("click", ".popover .peopleNeed.assigned", function (event) {
                AssignmentService.readSelectedPeopleNeedAndTimeSlotFromPopover(event, true);
                AssignmentService.taskToUserPerformUserFilterRemoveAssignment();
            });

            $(document).on("click", ".popover .peopleNeed:not(.assigned)", function (event) {
                AssignmentService.readSelectedPeopleNeedAndTimeSlotFromPopover(event, false);
                AssignmentService.taskToUserPerformUserFilter();
            });
        }

        /**
         * @memberOf AssignmentServiceClient
         * @summary Manage the task list checkbox "display assigned task" according to ReactiveVar CurrentAssignmentType
         * @locus client
         */
        static disableDisplayAssignedCheckbox(){
            var currentAssignmentType = CurrentAssignmentType.get();
            var checkbox = $("#display-assigned-task-checkbox");
            var label = $("#display-assigned-task-checkbox-label");
            switch (currentAssignmentType) {
                case AssignmentType.USERTOTASK:
                    checkbox.attr("disabled", true);
                    label.css("opacity",0.3);
                    break;
                case AssignmentType.TASKTOUSER:
                    checkbox.removeAttr("disabled");
                    label.css("opacity",1);
                    break;
                case AssignmentType.ALL:
                    checkbox.removeAttr("disabled");
                    label.css("opacity",1);
                    break;
            }

        }
    }

