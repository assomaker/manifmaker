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
    var skill4Id = Skills.insert({
        key: "RESP_TASK_4",
        label: "Responsable tache 4"
    });

    //assignmentCalendarDay
    AssignmentTerms.insert({
        name: "Terms 1",
        start: getDateFromDate(13, 5 - 1),
        end: getDateFromDate(15, 5 - 1)
    });
    AssignmentTerms.insert({
        name: "Terms 2",
        start: getDateFromDate(10, 5 - 1),
        end: getDateFromDate(11, 5 - 1)
    });
    AssignmentTerms.insert({
        name: "Terms 3",
        start: getDateFromDate(15, 5 - 1),
        end: getDateFromDate(27, 5 - 1)
    });

    //users
    var user1Id = Users.insert({
        name: "user1",
        teams: [team1Id],
        skills: [skill1Id],
        availabilities: [
            {
                start: getDateFromTime(2),
                end: getDateFromTime(14)
            }
        ]
    });
    var user2Id = Users.insert({
        name: "user2",
        teams: [team2Id],
        skills: [skill2Id],
        availabilities: [
            {
                start: getDateFromTime(2),
                end: getDateFromTime(16)
            }
        ]
    });
    var user3Id = Users.insert({
        name: "user3",
        //teams: [team3Id],
        skills: [skill2Id,skill3Id],
        availabilities: [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(14)
            },
            {
                start: getDateFromTime(14),
                end: getDateFromTime(18)
            }
        ]
    });
    var user4Id = Users.insert({
        name: "user4",
        //teams: [team3Id],
        skills: [skill2Id,skill3Id,skill1Id,skill4Id],
        availabilities: [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(14)
            },
            {
                start: getDateFromTime(14),
                end: getDateFromTime(18)
            }
        ]
    });

    var now = new Date();
    var aDayAgo = new moment().add("days",-1).toDate();
    //tasks
    var task1d = Tasks.insert({
        name: "task 1",
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
                end: getDateFromTime(14),
                peopleNeeded : [
                    {
                        userId: user2Id
                    },
                    {
                        userId: user4Id
                    },
                    {
                        userId: user1Id
                    },
                    {
                        teamId: team1Id,
                        skills: [skill1Id]
                    },
                    {
                        skills: [skill1Id]
                    },
                    {
                        skills: [skill1Id,skill2Id]
                    }
                ],
            }
        ],
        timeSlotValidation: {
            currentState: ValidationState.READY,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "good",
                    creationDate: now
                }
            ]
        },
        accessPassValidation: {
            currentState: ValidationState.READY,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "good",
                    creationDate: now
                }
            ]
        },
        equipmentValidation: {
            currentState: ValidationState.READY,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "good",
                    creationDate: now
                }
            ]
        }
    });
    var task2d = Tasks.insert({
        name: "task 2",
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
        ],
        timeSlotValidation: {
            currentState: ValidationState.REFUSED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "Dumbass, do you're fucking grammar",
                    creationDate: now
                }
            ]
        },
        accessPassValidation: {
            currentState: ValidationState.REFUSED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "Dumbass, do you're fucking grammar",
                    creationDate: now
                }
            ]
        },
        equipmentValidation: {
            currentState: ValidationState.REFUSED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "Dumbass, do you're fucking grammar",
                    creationDate: now
                }
            ]
        }
    });
    var task3d = Tasks.insert({
        name: "task 3",
        teamId: team3Id,
        placeId: place2Id,
        liveEventMasterId: user2Id,
        masterId: user2Id,
        timeSlots : [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(12),
                peopleNeeded : [
                    {
                        teamId: team1Id,
                        skills: [skill1Id]
                    }
                ]
            }
        ],
        timeSlotValidation: {
            currentState: ValidationState.TOBEVALIDATED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "send in validation",
                    creationDate: now
                }
            ]
        },
        accessPassValidation: {
            currentState: ValidationState.TOBEVALIDATED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "send in validation",
                    creationDate: now
                }
            ]
        },
        equipmentValidation: {
            currentState: ValidationState.TOBEVALIDATED,
            lastUpdateDate:now,
            comments: [
                {
                    author: "Gerard",
                    content: "send in validation",
                    creationDate: now
                }
            ]
        }
    });
    var task3d = Tasks.insert({
        name: "autre tache",
        teamId: team3Id,
        placeId: place2Id,
        liveEventMasterId: user2Id,
        masterId: user2Id,
        timeSlots : [
            {
                start: getDateFromTime(10),
                end: getDateFromTime(12),
                peopleNeeded : [
                    {
                        teamId: team1Id,
                        skills: [skill1Id]
                    }
                ]
            }
        ],
        timeSlotValidation: {
            currentState: ValidationState.OPEN,
            lastUpdateDate:now,
            comments: []
        },
        accessPassValidation: {
            currentState: ValidationState.OPEN,
            lastUpdateDate:now,
            comments: []
        },
        equipmentValidation: {
            currentState: ValidationState.OPEN,
            lastUpdateDate:now,
            comments: []
        }

    });


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
