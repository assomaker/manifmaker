AssignmentServiceClient =
    class AssignmentServiceClient {
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
    }

