Schemas = {};
SimpleSchema.messages({
    unknownId : `[label] doesn't exist`,
    endBeforeStart: `[label] must be after start date`,
    startAfterEnd: `[label] must be before end date`,
    skillsNotFound: 'Skills not found',
    taskAssignmentNotMatching: "Task assignment do not match real assignment"
});
