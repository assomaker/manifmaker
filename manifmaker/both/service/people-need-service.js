PeopleNeedService =
    class PeopleNeedService {

        static getPeopleNeedIndex(timeSlot, peopleNeedHunter) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                if (peopleNeed._id === peopleNeedHunter._id) {
                    found = index;
                }
            });
            return found;


        }

        static getPeopleNeedByIdAndTask(peopleNeedId,task) {
            var found;
            var timeSlotIdFound;

            task.timeSlots.forEach(timeSlot => {
                timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                    if (peopleNeed._id === peopleNeedId) {
                        found = peopleNeed;
                    }
                });
                if(!timeSlotIdFound && found)
                    timeSlotIdFound = timeSlot._id;

            });

            return {
                timeSlotId: timeSlotIdFound,
                peopleNeed: found
            };


        }

        static getAssignedPeopleNeedIndex(timeSlot, peopleNeedHunter) {
            var found;
            timeSlot.peopleNeededAssigned.forEach(function (peopleNeed, index) {
                if (peopleNeed._id === peopleNeedHunter._id) {
                    found = index;
                }
            });
            return found;


        }


        static removePeopleNeed(task, timeSlot, peopleNeed, userId) {
            console.info("PeopleNeedService.removePeopleNeed for task", task, "when", timeSlot, "and need", peopleNeed);
            //we have the task
            var timeSlots = task.timeSlots; //all its timeslots
            //var peopleNeeded = timeSlot.peopleNeeded; //all its peopleNeed


            var updatedTimeslot = timeSlot;

            //attention a ne pas pas perdre les poineteurs de tableau et du conteu des tableaux


            var timeSlotToUpdateIndex = TimeSlotService.getTimeSlotIndex(task, timeSlot._id);
            var timeSlotToUpdate = timeSlots[timeSlotToUpdateIndex];
            var peopleNeedToRemoveIndex = PeopleNeedService.getPeopleNeedIndex(timeSlotToUpdate, peopleNeed);
            //remove peopleNeed assigned
            timeSlotToUpdate.peopleNeeded.splice(peopleNeedToRemoveIndex, 1);

            //store assigned user
            peopleNeed.assignedUserId = userId;
            timeSlotToUpdate.peopleNeededAssigned.push(peopleNeed);


            Tasks.update({_id: task._id}, {$set: {timeSlots: timeSlots}});

        }

        static checkPeopleNeedForUser(task, timeSlot, peopleNeed, user) {
            console.info("PeopleNeedService.checkPeopleNeed for task", task, "when", timeSlot, "and need", peopleNeed, "for user", user);


            if (peopleNeed.userId) {
                if (peopleNeed.userId === user._id) {
                    return true;
                } else {
                    return false;
                }
            } else if (peopleNeed.teamId) {

                if (!_.contains(user.teams, peopleNeed.teamId)) {
                    return false;
                }
            }
            if (peopleNeed.skills.length == 0) return true;

            var userHasAllSkills = true;
            _.each(peopleNeed.skills, (skill) => {
                if (!_.contains(user.skills, skill)) {
                    userHasAllSkills = false;
                }
            });
            return userHasAllSkills;
        }

        static getPeopleNeedById(timeSlot, _id) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                console.log(arguments);
                if (peopleNeed._id === _id) {
                    found = peopleNeed;
                }
            });
            return found;
        }

        static restorePeopleNeed(task, timeSlot, peopleNeed, userId) {
            console.info("PeopleNeedService.restorePeopleNeed for task", task, "when", timeSlot, "and need", peopleNeed);
            //we have the task
            var timeSlots = task.timeSlots; //all its timeslots
            //var peopleNeeded = timeSlot.peopleNeeded; //all its peopleNeed


            var updatedTimeslot = timeSlot;

            //attention a ne pas pas perdre les poineteurs de tableau et du conteu des tableaux


            var timeSlotToUpdateIndex = TimeSlotService.getTimeSlotIndex(task, timeSlot._id);
            var timeSlotToUpdate = timeSlots[timeSlotToUpdateIndex];


            //remove peopleNeed assigned
            var assignedPeopleNeedToRemoveIndex = PeopleNeedService.getAssignedPeopleNeedIndex(timeSlotToUpdate, peopleNeed);
            timeSlotToUpdate.peopleNeededAssigned.splice(assignedPeopleNeedToRemoveIndex, 1);


            //restore peopleNeed
            delete peopleNeed.assignedUserId;
            timeSlotToUpdate.peopleNeeded.push(peopleNeed);


            Tasks.update({_id: task._id}, {$set: {timeSlots: timeSlots}});
        }
    }
