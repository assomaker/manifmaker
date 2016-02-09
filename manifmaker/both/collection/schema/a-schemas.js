Schemas = {};
SimpleSchema.messages({
    unknownId: `[label] could not be find in database`,
    unknownIdOrDuplicateId: `[label] could not be find in database or is duplicated`,
    duplicate: `[label] is duplicated`,
    endBeforeStart: `[label] must be after start date`,
    startAfterEnd: `[label] must be before end date`,
    timeSlotConflictDate: `Time slot can't overlap. Check time slot start and end date conflicts with all others time slots`,
    skillsNotFound: 'Skills not found',
    taskAssignmentNotMatching: "Task assignment do not match real assignment",
    userAssignmentNotMatching: "User assignment do not match real assignment"
});

Schemas.helpers = {};

Schemas.helpers.allTeamsOptions = function () {
    var teams = Teams.find({
        name: {
            $ne: ASSIGNMENTREADYTEAM
        }
    }).fetch();
    var result = [];
    _.each(teams, function (team) {
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

Schemas.helpers.allSkillsOptions = function () {
    var skills = Skills.find({}).fetch();
    var result = [];
    _.each(skills, function (skill) {
        result.push({
            label: skill.label,
            value: skill._id
        });
    });

    return result;
};

Schemas.helpers.allRolesOptions = function () {
    var skills = Meteor.roles.find({}).fetch();
    var result = [];
    _.each(skills, function (role) {
        result.push({
            label: role.name,
            value: role.name
        });
    });

    return result;
};

Schemas.helpers.allGroupRolesOptions = function () {
    var skills = GroupRoles.find({}).fetch();
    var result = [];
    _.each(skills, function (groupRole) {
        result.push({
            label: groupRole.name + " : " +groupRole.roles,
            value: groupRole._id
        });
    });

    return result;
};
