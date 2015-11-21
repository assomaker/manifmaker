Template.registerHelper(
    "displayHours", function (date) {
        return new moment(date).format("H[h]");
    }
);