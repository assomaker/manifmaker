Template.registerHelper(
    "displayHours", function (date) {
        return new moment(date).format("H[h]");
    }
);
Template.registerHelper(
    "skillLabel", function () {
        return Skills.findOne({_id:this.toString()}).label;
    }
);