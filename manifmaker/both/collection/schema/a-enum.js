/**
 * @memberOf Models
 * @summary Enum Validation State used to store into database
 * values : OPEN, TOBEVALIDATED, REFUSED, READY
 * @enum {string}
 * @readonly
 * @locus Anywhere
 */
ValidationState = {
    "OPEN": "OPEN",
    "TOBEVALIDATED": "TOBEVALIDATED",
    "REFUSED": "REFUSED",
    "READY": "READY"
};

/**
* @memberOf Models
* @summary Enum Validation State used to friendly display validation state to user
* values : OPEN, TOBEVALIDATED, REFUSED, READY
* @enum {string}
* @readonly
* @locus Anywhere
*/
DisplayedValidationState = {
    "OPEN": "open",
    "TOBEVALIDATED": "to be validated",
    "REFUSED": "refused",
    "READY": "ready"
};

/**
 * @memberOf Models
 * @summary Enum Validation State used to pass information through URL
 * values : open, to-be-validated, refuse, ready
 * @enum {string}
 * @readonly
 * @locus Anywhere
 */
ValidationStateUrl= {
    "open":"OPEN",
    "to-be-validated": "TOBEVALIDATED",
    "refuse": "REFUSED",
    "ready":"READY"
};

/**
 * @memberOf Models
 * @summary Validation Type used to pass information through URL
 * values : time-slot, access, equipment
 * @enum {string}
 * @readonly
 * @locus Anywhere
 */
ValidationTypeUrl = {
    "time-slot": "timeSlotValidation",
    "access-pass": "accessPassValidation",
    "equipment": "equipmentValidation"
};

/*
 OPEN -> TOBEVALIDATED
 TOBEVALIDATED -> REFUSED
 REFUSED -> READY
 READY -> REFUSED
*/