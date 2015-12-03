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


Template.registerHelper('ifNotEmpty', function(item, options) {
    if(item){
        if(item instanceof Array){
            if(item.length > 0){
                return options.fn(this);
            }else{
                return options.inverse(this);
            }
        }else{
            if(item.fetch().length > 0){
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }else{
        return options.inverse(this);
    }
});
