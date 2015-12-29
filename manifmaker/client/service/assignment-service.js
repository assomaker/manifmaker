AssignmentServiceClient =
    class AssignmentServiceClient {
        static setCalendarAccuracy(accuracy) {

            _.each(AssignmentCalendarDisplayedHours.find().fetch(),function(doc){
                AssignmentCalendarDisplayedHours.remove(doc._id)
            });
            _.each(AssignmentCalendarDisplayedQuarter.find().fetch(),function(doc){
                AssignmentCalendarDisplayedQuarter.remove(doc._id)
            });
            _.each(AssignmentCalendarDisplayedAccuracy.find().fetch(),function(doc){
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

        static setCalendarTerms() {
            _.each(AssignmentCalendarDisplayedDays.find().fetch(),function(doc){
                AssignmentCalendarDisplayedDays.remove(doc._id)
            });

            var terms = AssignmentTerms.find({}).fetch();

            AssignmentCalendarDisplayedDays.insert({
                date: terms[0].start
            });
        }
    }

