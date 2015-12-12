
populateData =  function () {
    //Users.remove({});
    //Tasks.remove({});
    //Assignments.remove({});

    var user1 = new User("user1", [
            new Availability(getDateFromTime(2), getDateFromTime(12)),
            new Availability(getDateFromTime(18), getDateFromTime(22))]
    );
    var user2 = new User("user2", [
        new Availability(getDateFromTime(10), getDateFromTime(20))
    ]);
    var user3 = new User("user3", [
        new Availability(getDateFromTime(10), getDateFromTime(14)),
        new Availability(getDateFromTime(16), getDateFromTime(18)),
        new Availability(getDateFromTime(20), getDateFromTime(22))
    ]);

    var user4 = new User("MichMich", [
    ]);

    user1 = insertAndFetch(Users, user1);
    user2 = insertAndFetch(Users, user2);
    user3 = insertAndFetch(Users, user3);
    user4 = insertAndFetch(Users, user4);

    var place1= new Place ("place1");
    var place2= new Place ("place2");
    var place3= new Place ("place3");

    place1= insertAndFetch(Places, place1);
    place2= insertAndFetch(Places, place2);
    place3= insertAndFetch(Places, place3);

    var team1= new Team ("team1");
    var team2= new Team("team2");
    var team3= new Team("team3");
    var team4= new Team("team4");
    var team5= new Team("team5");
    var team6= new Team("team6");

    team1= insertAndFetch(Teams, team1);
    team2= insertAndFetch(Teams, team2);
    team3= insertAndFetch(Teams, team3);
    team4= insertAndFetch(Teams, team4);
    team5= insertAndFetch(Teams, team5);
    team6= insertAndFetch(Teams, team6);



    var task1 = new Task("task1", [
        new TimeSlot(getDateFromTime(8), getDateFromTime(11), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
        new TimeSlot(getDateFromTime(4), getDateFromTime(6), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
    ], [], place1._id, team1._id, "resp1", "description1");
    var task2 = new Task("task2", [
        new TimeSlot(getDateFromTime(10), getDateFromTime(12), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE]),
        new TimeSlot(getDateFromTime(14), getDateFromTime(22), [PeopleNeed.JUNKRESP, PeopleNeed.SOFT, PeopleNeed.SOFT, PeopleNeed.SOFTDRIVINGLICENSE])
    ], [], place2._id, team2._id, "resp2", "description2");
    var task3 = new Task("task3", [], [], place3._id, team3._id, "resp3","description3");

    task1 = insertAndFetch(Tasks, task1);
    task2 = insertAndFetch(Tasks, task2);
    task3 = insertAndFetch(Tasks, task3);










    //Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[0]._id);
    //Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[1]._id);


    CalendarDays.insert(new CalendarDay(getDateFromDate(13, 5 - 1)));
    //CalendarDays.insert(new CalendarDay(getDateFromDate(14, 5)));
    //CalendarDays.insert(new CalendarDay(getDateFromDate(15, 5)));

    var accuracy = CalendarAccuracyEnum["1"];
    Meteor.call("setCalendarAccuracy",accuracy);
};

insertAndFetch = function (Collection, data) {
    var _id = Collection.insert(data);
    return Collection.findOne({_id: _id});
};

getDateFromTime = function (hours, minutes = 0) {
    var now = new Date();
    return new Date(now.getYear(), 5 - 1 /*now.getMonth()*/, 13 /*now.getDate()*/, hours, minutes, 0);
};

getDateFromDate = function (day, month, year) {
    var now = new Date();
    year = year || now.getYear();
    month = month || now.getMonth();
    return new Date(year, month, day, 0, 0, 0);
};
