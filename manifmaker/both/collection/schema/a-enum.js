ValidationState = {
    "OPEN": "OPEN",
    "TOBEVALIDATED": "TOBEVALIDATED",
    "REFUSED": "REFUSED",
    "READY": "READY"
};

DisplayedValidationState = {
    "OPEN": "open",
    "TOBEVALIDATED": "to be validated",
    "REFUSED": "refused",
    "READY": "ready"
};

ValidationStateUrl= {
    "open":"OPEN",
    "to-be-validated": "TOBEVALIDATED",
    "refuse": "REFUSED",
    "ready":"READY"
};


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