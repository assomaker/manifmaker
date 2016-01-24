/**
 * @memberOf Models
 * @summary Enum assignment type
 * values : USERTOTASK, TASKTOUSER, ALL
 * @enum {string}
 * @readonly
 * @locus Anywhere
 */
AssignmentType = {
    USERTOTASK: "userToTask",
    TASKTOUSER: "taskToUser",
    ALL: "all"
};

ASSIGNMENTREADYTEAM = "assignmentReadyTeam"; //team de tous les users et toutes les taches prets pour affectation


/**
 * @memberOf Models
 * @summary Enum for assignment calendar accuracy. Configure how many hours per days are displayed.
 * values : 025,  05, 1, 2, 4
 * @example 0.25 * one hour, 4 * one hour
 * @enum {string}
 * @readonly
 * @locus Anywhere
 */
CalendarAccuracyEnum = {
    "0.25": 0.25,
    "0.5": 0.5,
    "1": 1,
    "2": 2,
    "4": 4
};


