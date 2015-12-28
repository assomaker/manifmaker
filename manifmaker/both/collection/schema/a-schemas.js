Schemas = {};
SimpleSchema.messages({
    unknownId : `[label] could not be find in database`,
    endBeforeStart: `[label] must be after start date`,
    startAfterEnd: `[label] must be before end date`,
    skillsNotFound: 'Skills not found',
    taskAssignmentNotMatching: "Task assignment do not match real assignment",
    userAssignmentNotMatching: "User assignment do not match real assignment"
});

Schemas.helpers = {};

Schemas.helpers.allTeamsOptions = function(){
    var teams = Teams.find({}).fetch();
    var result = [];
    _.each(teams,function(team){
        result.push({
            label: team.name,
            value: team._id
        });
    });

    return result;
};
