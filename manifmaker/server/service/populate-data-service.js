populateData = function () {

    Assignments.remove({});
    Users.remove({});
    Tasks.remove({});
    CalendarDays.remove({});
    CalendarHours.remove({});
    CalendarQuarter.remove({});
    CalendarAccuracy.remove({});
    Skills.remove({});
    Teams.remove({});

    var assignmentReadyTeam = new Team(ASSIGNMENTREADYTEAM); //init data
    assignmentReadyTeam = insertAndFetch(Teams,assignmentReadyTeam);

    var team1 = new Team("team1");
    var team2 = new Team("team2");

    team1 = insertAndFetch(Teams,team1);
    team2 = insertAndFetch(Teams,team2);


    var skill1 = new Skill("RESPTASK1", "Responsable tache 1");
    var skill2 = new Skill("RESPTASK2", "Responsable tache 2");
    var skill3 = new Skill("RESPTASK3", "Responsable tache 3");
    var skill4 = new Skill("RESPTASK4", "Responsable tache 4");
    var skill5 = new Skill("RESPTASK5", "Responsable tache 5");
    var skill6 = new Skill("DRIVINGLICENSE", "Permis de conduire +21 +3ans");

    skill1 = insertAndFetch(Skills, skill1);
    skill2 = insertAndFetch(Skills, skill2);
    skill3 = insertAndFetch(Skills, skill3);
    skill4 = insertAndFetch(Skills, skill4);
    skill5 = insertAndFetch(Skills, skill5);
    skill6 = insertAndFetch(Skills, skill6);


    //il reste les equipes à prendre en compte pour les PeopleNeeded

    var user1 = new User("user1", [team1._id], [
            new Availability(getDateFromTime(2), getDateFromTime(12)),
            new Availability(getDateFromTime(18), getDateFromTime(22))],
        [skill1._id]
    );
    var user2 = new User("user2", [team1._id], [
            new Availability(getDateFromTime(10), getDateFromTime(20))],
        [
           skill2._id
        ]
    );
    var user3 = new User("user3", [team1._id], [
            new Availability(getDateFromTime(10), getDateFromTime(14)),
            new Availability(getDateFromTime(16), getDateFromTime(18)),
            new Availability(getDateFromTime(20), getDateFromTime(22))],
       [skill1._id, skill2._id, skill3._id]
    );


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

    var team3= new Team("team3");
    var team4= new Team("team4");
    var team5= new Team("team5");
    var team6= new Team("team6");

    team3= insertAndFetch(Teams, team3);
    team4= insertAndFetch(Teams, team4);
    team5= insertAndFetch(Teams, team5);
    team6= insertAndFetch(Teams, team6);



    var peopleNeed1 = new PeopleNeed({
        skills: [],//skill1._id]
        teamId : team1._id, //will be ignored if userId is setup
       // userId: user3._id
    });
    var peopleNeed2 = new PeopleNeed({
        skills: [skill2._id],
        teamId : team1._id
    });
    var peopleNeed3 = new PeopleNeed({
        skills: [skill1._id, skill2._id, skill3._id, skill4._id, skill5._id],
        //userId: user1._id
    });

    var task1 = new Task("task1", [
        new TimeSlot(getDateFromTime(2), getDateFromTime(4), [peopleNeed1,peopleNeed2]),
        new TimeSlot(getDateFromTime(6), getDateFromTime(8), [peopleNeed1])],
        [],
        [],
        team1._id);
    var task2 = new Task("task2", [
        new TimeSlot(getDateFromTime(10), getDateFromTime(12), [peopleNeed2]),
        new TimeSlot(getDateFromTime(14), getDateFromTime(22), [peopleNeed2])
    ],
        [],
        [],
        team2._id);
    var task3 = new Task("task3", [
        new TimeSlot(getDateFromTime(10), getDateFromTime(12), [peopleNeed1,peopleNeed2,peopleNeed3])
    ],
        [],
        [],
        team3._id);

    var task4 = new Task("task4", [
        new TimeSlot(getDateFromTime(14), getDateFromTime(16), [peopleNeed2,peopleNeed3])
    ],
        [],
        [],
        team4._id);


    task1 = insertAndFetch(Tasks, task1);
    task2 = insertAndFetch(Tasks, task2);
    task3 = insertAndFetch(Tasks, task3);
    task4 = insertAndFetch(Tasks, task4);

    var group1= new Group ("group1",[task1._id, task2._id],team1._id);
    var group2= new Group ("group2", [task3._id], team3._id);

    group1 = insertAndFetch(Groups, group1);
    group2 = insertAndFetch(Groups, group2);


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
    month = month || now.getMonth();
    return new Date(year, month, day, 0, 0, 0);
};
