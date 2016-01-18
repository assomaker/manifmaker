PeopleNeedService =
    class PeopleNeedService {

        /**
         * @memberOf PeopleNeedService
         * @summary For a give timeSlot, user peopleNeedHunter._id to get the index of the people need.
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {peopleNeed} peopleNeedHunter
         * @returns {peopleNeed|null}
         */
        static getPeopleNeedIndex(timeSlot, peopleNeedHunter) {
            var found;
            timeSlot.peopleNeeded.forEach(function (peopleNeed, index) {
                if (peopleNeed._id === peopleNeedHunter._id) {
                    found = index;
                }
            });
            return found;


        }

        /**
         * @memberOf PeopleNeedService
         * @summary Find people need and time slot id for a given task by people need id.
         * @locus Anywhere
         * @param {MongoId} peopleNeedId
         * @param {Task} task
         * @returns {{timeSlotId: {MongoId}, peopleNeed: {PeopleNeed}}}
         */
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

        /**
         * @memberOf PeopleNeedService
         * @summary Find people need assigned and time slot id for a given task by people need id.
         * @locus Anywhere
         * @param {MongoId} peopleNeedId
         * @param {Task} task
         * @returns {{timeSlotId: {MongoId}, peopleNeed: {PeopleNeed}}}
         */
        static getAssignedPeopleNeedByIdAndTask(peopleNeedId,task) {
            var found;
            var timeSlotIdFound;

            task.timeSlots.forEach(timeSlot => {
                timeSlot.peopleNeededAssigned.forEach(function (peopleNeed, index) {
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


        /**
         * @memberOf PeopleNeedService
         * @summary For a given timeSlot, user peopleNeedHunter._id to get the people need.
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {peopleNeed} peopleNeedHunter
         * @returns {peopleNeed|null}
         */
        static getAssignedPeopleNeedIndex(timeSlot, peopleNeedHunter) {
            var found;
            timeSlot.peopleNeededAssigned.forEach(function (peopleNeed, index) {
                if (peopleNeed._id === peopleNeedHunter._id) {
                    found = index;
                }
            });
            return found;


        }


        /**
         * @memberOf PeopleNeedService
         * @summary Move people need from task's peopleNeeded to task's peopleNeededAssigned
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {Task} task
         * @param {TimeSlot} timeSlot
         * @param {PeopleNeed} peopleNeed
         * @param {MongoId} userId
         */
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

        /**
         * @memberOf PeopleNeedService
         * @summary Check if people need match user (userId or teamId and/or skills). True is user match people need.
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {Task} task
         * @param {TimeSlot} timeSlot
         * @param {PeopleNeed} peopleNeed
         * @param {User} user
         * @return {boolean}
         */
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

        /**
         * @memberOf PeopleNeedService
         * @summary Find people need by _id from time slot
         * @locus Anywhere
         * @param {timeSlot} timeSlot
         * @param {TimeSlot} timeSlot
         * @param {MongoId} peopleNeed
         * @return {PeopleNeed}
         */
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

        /**
         * @memberOf PeopleNeedService
         * @summary Move back people need from task's peopleNeededAssigned to task's peopleNeeded
         * @locus Anywhere
         * @param {Task} task
         * @param {timeSlot} timeSlot
         * @param {PeopleNeed} peopleNeed
         * @param {MongoId} userId
         */
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
