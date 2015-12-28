populateData = function () {

    _.each(AllCollections, function (coll) {
        coll.remove({});
    });

    //teams
    var team1Id = Teams.insert({name: "team1"});
    var team2Id = Teams.insert({name: "team2"});
    var team3Id = Teams.insert({name: "team3"});
    var assignmentReadyTeam = Teams.insert({name: ASSIGNMENTREADYTEAM});


    //places
    var place1Id = Places.insert({name: "place1"});
    var place2Id = Places.insert({name: "place2"});
    var place3Id = Places.insert({name: "place3"});

    //skills
    var skill1Id = Skills.insert({
        key: "RESP_TASK_1",
        label: "Responsable tache 1"
    });
    var skill2Id = Skills.insert({
        key: "RESP_TASK_2",
        label: "Responsable tache 2"
    });
    var skill3Id = Skills.insert({
        key: "RESP_TASK_3",
        label: "Responsable tache 3"
    });

    //assignmentCalendarDay
    AssignmentCalendarDay.insert({
        date: getDateFromDate(13, 5 - 1)
    });

    //users
    var user1Id = Users.insert({
        name: "user1",
        teams: [team1Id],
        skills: [skill1Id],
        availabilities: [
            {
                start: getDateFromTime(2),
                end: getDateFromTime(12)
            }
        ]
    });
    var user2Id = Users.insert({
        name: "user2",
        teams: [team2Id],
        skills: [skill2Id],
        availabilities: [
            {
                start: getDateFromTime(12),
                end: getDateFromTime(20)
            }
        ]
    });
    var user3Id = Users.insert({
        name: "user3",
        //teams: [team3Id],
        skills: [skill3Id],
        availabilities: [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(12)
            },
            {
                start: getDateFromTime(14),
                end: getDateFromTime(18)
            }
        ]
    });

    //tasks
    var task1d = Tasks.insert({
        name: "task1",
        teamId: team1Id,
        placeId: place1Id,
        liveEventMasterId: user1Id,
        masterId: user1Id,
        timeSlots : [
            {
                start: getDateFromTime(2),
                end: getDateFromTime(4),
                peopleNeeded : [
                    {
                        teamId: team1Id
                    }
                ],
            },
            {
                start: getDateFromTime(10),
                end: getDateFromTime(12),
                peopleNeeded : [
                    {
                        teamId: team1Id
                    },
                    {
                        skills: [skill1Id]
                    }
                ],
            }
        ]
    });
    var task2d = Tasks.insert({
        name: "task2",
        teamId: team2Id,
        placeId: place2Id,
        liveEventMasterId: user2Id,
        masterId: user2Id,
        timeSlots : [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(12),
                peopleNeeded : [
                    {
                        teamId: team2Id,
                        skills: [skill2Id]
                    }
                ]
            }
        ]
    });


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
