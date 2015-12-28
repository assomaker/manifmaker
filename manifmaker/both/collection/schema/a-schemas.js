Schemas = {};
SimpleSchema.messages({
    unknownId: `[label] could not be find in database`,
    endBeforeStart: `[label] must be after start date`,
    startAfterEnd: `[label] must be before end date`,
    skillsNotFound: 'Skills not found',
    taskAssignmentNotMatching: "Task assignment do not match real assignment",
    userAssignmentNotMatching: "User assignment do not match real assignment"
});

Schemas.helpers = {};

Schemas.helpers.allTeamsOptions = function () {
    var teams = Teams.find({}).fetch();
    var result = [];
    _.each(teams, function (team) {
        if (team.name !== ASSIGNMENTREADYTEAM)
            result.push({
                label: team.name,
                value: team._id
            });
    });

    return result;
};

Schemas.helpers.allPlacesOptions = function () {
    var places = Places.find({}).fetch();
    var result = [];
    _.each(places, function (place) {
        result.push({
            label: place.name,
            value: place._id
        });
    });

    return result;
};


Schemas.helpers.allUsersOptions = function () {
    var users = Users.find({}).fetch();
    var result = [];
    //TODO mettre le current user en premier
    _.each(users, function (user) {
        result.push({
            label: user.name,
            value: user._id
        });
    });

    return result;
};

