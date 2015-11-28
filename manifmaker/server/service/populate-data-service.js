populateData = function () {
    //Users.remove({});
    //Tasks.remove({});
    //Assignments.remove({});

    var team1 = new Team("team1");
    var team2 = new Team("team2");

    team1 = insertAndFetch(Teams,team1);
    team2 = insertAndFetch(Teams,team2);


    var skill1 = new Skill("RESPTASK1", "Responsable tache 1");
    var skill2 = new Skill("RESPTASK2", "Responsable tache 2");
    var skill3 = new Skill("DRIVINGLICENSE", "Permis de conduire +21 +3ans");

    skill1 = insertAndFetch(Skills, skill1);
    skill2 = insertAndFetch(Skills, skill2);
    skill3 = insertAndFetch(Skills, skill3);


    //il reste les equipes à prendre en compte pour les PeopleNeeded

    var user1 = new User("user1", [team1._id], [
            new Availability(getDateFromTime(2), getDateFromTime(12)),
            new Availability(getDateFromTime(18), getDateFromTime(22))],
        []
    );
    var user2 = new User("user2", [team2._id], [
            new Availability(getDateFromTime(2), getDateFromTime(20))],
        [
            skill2._id
        ]
    );
    var user3 = new User("user3", [team1._id, team2._id], [
            new Availability(getDateFromTime(10), getDateFromTime(14)),
            new Availability(getDateFromTime(16), getDateFromTime(18)),
            new Availability(getDateFromTime(20), getDateFromTime(22))],
       [skill1._id, skill2._id]
    );


    user1 = insertAndFetch(Users, user1);
    user2 = insertAndFetch(Users, user2);
    user3 = insertAndFetch(Users, user3);

    var peopleNeed1 = new PeopleNeed({
        skills: [],//skill1._id]
        teamId : team1._id
    });
    var peopleNeed2 = new PeopleNeed({
        skills: [skill2._id],
        teamId : team2._id
    });
    var peopleNeed3 = new PeopleNeed({
        skills: [skill1._id, skill2._id, skill3._id]
    });

    var task1 = new Task("task1", [
        new TimeSlot(getDateFromTime(2), getDateFromTime(4), [peopleNeed1]),
        new TimeSlot(getDateFromTime(6), getDateFromTime(8), [peopleNeed1])
    ]);
    var task2 = new Task("task2", [
        new TimeSlot(getDateFromTime(10), getDateFromTime(12), [peopleNeed2]),
        new TimeSlot(getDateFromTime(14), getDateFromTime(22), [peopleNeed2])
    ]);
    var task3 = new Task("task3", [
        new TimeSlot(getDateFromTime(10), getDateFromTime(12), [peopleNeed1,peopleNeed2,peopleNeed3])
    ]);

    task1 = insertAndFetch(Tasks, task1);
    task2 = insertAndFetch(Tasks, task2);
    task3 = insertAndFetch(Tasks, task3);

    //Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[0]._id);
    //Meteor.call("assignUserToTaskTimeSlot", user1._id, task1._id, task1.timeSlots[1]._id);


    CalendarDays.insert(new CalendarDay(getDateFromDate(13, 5 - 1)));
    //CalendarDays.insert(new CalendarDay(getDateFromDate(14, 5)));
    //CalendarDays.insert(new CalendarDay(getDateFromDate(15, 5)));

    var accuracy = CalendarAccuracyEnum["1"];
    Meteor.call("setCalendarAccuracy", accuracy);
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
    month = month || now.getMonth()
    return new Date(year, month, day, 0, 0, 0);
};
