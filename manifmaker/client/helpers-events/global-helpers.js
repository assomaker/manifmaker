Template.registerHelper(
    "displayHours", function (date) {
        return new moment(date).format("H[h]");
    }
);
Template.registerHelper(
    "displayHoursMinute", function (date) {
        return new moment(date).format("H[h]mm");
    }
);
Template.registerHelper(
    "displayDateTime", function (date) {
        return new moment(date).format("ddd DD MMM HH[h]");
    }
);
Template.registerHelper(
    "skillLabel", function () {
        return Skills.findOne({_id: this.toString()}).label;
    }
);

Template.registerHelper(
    "displayUser", function () {
        var assignment = Assignments.findOne({
            peopleNeedId: this._id
        }); //TODO normalement je stocke un assignedUserId...
        return Users.findOne({_id: assignment.userId}).name;
    }
);

Template.registerHelper(
    "allTeams", function () {
        return Teams.find();
    }
);

Template.registerHelper('equals', function (a, b) {
    return a === b;
});


Template.registerHelper(
    "allOptionsTeams", function () {
        return Teams.find({
            name: {
                $ne: ASSIGNMENTREADYTEAM
            }
        });
    }
);

Template.registerHelper(
    "allOptionsSkills", function () {
        return Skills.find({});
    }
);


Template.registerHelper('ifNotEmpty', function (item, options) {
    if (item) {
        if (item instanceof Array) {
            if (item.length > 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        } else {
            if (item.fetch().length > 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    } else {
        return options.inverse(this);
    }
});

Template.registerHelper("equals", function (a, b) {
        return a === b;
    }
);
