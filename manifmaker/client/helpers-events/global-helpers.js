Template.registerHelper(
    "displayHours", function (date) {
        return new moment(date).format("H[h]");
    }
);
Template.registerHelper(
    "equals", function (a, b) {
       return a === b;
    }
);
