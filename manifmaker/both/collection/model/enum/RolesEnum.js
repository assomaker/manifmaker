/**
 * @memberOf Enum
 * @summary Usable role to filter access right
 * @enum {string}
 * @readonly
 * @locus Anywhere
 */
RolesEnum = {
    /** global */
    MANIFMAKER: "MANIFMAKER",

    /** task */
    TASKREAD: "TASKREAD",
    /** task */
    TASKWRITE: "TASKWRITE",
    /** task */
    TASKDELETE: "TASKDELETE",
    /** task */
    ACCESSPASSVALIDATION: "ACCESSPASSVALIDATION",
    /** task */
    EQUIPMENTVALIDATION: "EQUIPMENTVALIDATION",
    /** task */
    ASSIGNMENTVALIDATION: "ASSIGNMENTVALIDATION",

    /** assignment */
    ASSIGNMENTTASKUSER: "ASSIGNMENTTASKUSER",

    /** user */
    USERREAD: "USERREAD",
    /** user */
    USERWRITE: "USERWRITE",
    /** user */
    USERDELETE: "USERDELETE",

    /** conf */
    CONFMAKER: "CONFMAKER",
    /** conf */
    ROLE: "ROLE"
};