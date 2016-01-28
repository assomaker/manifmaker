AvailabilityService =
    class AvailabilityService {
        /**
         * @memberOf AvailabilityService
         * @summary For a giver user get availability which start at least before param start and end at most after end param.
         * @locus Anywhere
         * @param {User} user
         * @param {Date}start
         * @param {Date} end
         * @returns {availability|null}
         */
        static getSurroundingAvailability(user, start, end) {
            console.info("AvailabilityService.getAvailability start:", start, "end", end, "for user", user);
            var found;
            var start = new moment(start);
            if (typeof end === "undefined") var end = new moment(start);
            else
                var end = new moment(end);
            var end = new moment(end);
            user.availabilities.forEach(availability => {
                var availabilityStart = new moment(availability.start);
                var availabilityEnd = new moment(availability.end);
                if (( availabilityStart.isBefore(start) || availabilityStart.isSame(start))
                    && (availabilityEnd.isAfter(end) || availabilityEnd.isSame(end) )) {
                    found = availability;
                    return false;
                }
            });
            return found;
        }

        /**
         * @memberOf AvailabilityService
         * @summary For a giver user get availability index which start at least before param start and end at most after end param.
         * @locus Anywhere
         * @param {User} user
         * @param {Date}start
         * @param {Date} end
         * @returns {availabilityId|null}
         */
        static getIndexOfSurroundingAvailability(user, start, end) {
            console.info("AvailabilityService.getAvailability start:", start, "end", end, "for user", user);
            var found;
            var start = new moment(start);
            if (typeof end === "undefined") var end = new moment(start);
            else
                var end = new moment(end);
            var end = new moment(end);
            user.availabilities.forEach(function (availability, index, availabilities) {
                var availabilityStart = new moment(availability.start);
                var availabilityEnd = new moment(availability.end);
                if (( availabilityStart.isBefore(start) || availabilityStart.isSame(start))
                    && (availabilityEnd.isAfter(end) || availabilityEnd.isSame(end) )) {
                    found = index;
                    return false;
                }
            });
            return found;
        }

        /**
         * @memberOf AvailabilityService
         * @summary For a giver user splice and merge availabilities in order to make him unavailable between start and end params.
         * @locus Anywhere
         * @param {User} user
         * @param {Date}start
         * @param {Date} end
         */
        static removeAvailabilities(user, start, end) {
            console.info("AvailabilityService.splitAvailabilities for user", user, " from", start, "to", end);
            var availabilities = user.availabilities;

            var availabilityIndex = AvailabilityService.getIndexOfSurroundingAvailability(user, start, end);
            //remove old availability
            var availability = availabilities.splice(availabilityIndex, 1)[0];
            //add new availabilities and prevent creating a 0minutes availability
            if (!new moment(availability.start).isSame(new moment(start)))
                availabilities.push({
                    start: availability.start,
                    end: start
                });
            if (!new moment(end).isSame(new moment(availability.end)))
                availabilities.push({
                    start: end,
                    end: availability.end
                });

            Users.update({_id: user._id}, {$set: {availabilities: availabilities}});

        }

        /**
         * @memberOf AvailabilityService
         * @summary Read the name...
         * @locus Anywhere
         * @param {User} user
         * @param {Date}start
         * @returns {availability|null}
         */
        static getIndexOfAvailabilityWhichEndWhenParamStart(user, start) {
            console.info("AvailabilityService.getIndexOfAvailabilityWhichEndWhenParamStart start:", start, "for user", user);
            var found;
            var start = new moment(start);

            user.availabilities.forEach(function (availability, index, availabilities) {
                var availabilityEnd = new moment(availability.end);
                if (availabilityEnd.isSame(start)) {
                    found = index;
                    return false;
                }
            });
            return found;
        }

        /**
         * @memberOf AvailabilityService
         * @summary Read the name...
         * @locus Anywhere
         * @param {User} user
         * @param {Date}start
         * @returns {availabilityId|null}
         */
        static getIndexOfAvailabilityWhichStartWhenParamEnd(user, end) {
            console.info("AvailabilityService.getIndexOfAvailabilityWhichStartWhenParamEnd end:", end, "for user", user);
            var found;
            var end = new moment(end);

            user.availabilities.forEach(function (availability, index, availabilities) {
                var availabilityStart = new moment(availability.start);
                if (availabilityStart.isSame(end)) {
                    found = index;
                    return false;
                }
            });
            return found;
        }

        /**
         * @memberOf AvailabilityService
         * @summary For a giver user add and merge availabilities in order to make him available between start and end params.
         * @locus Anywhere
         * @param {User} user
         * @param {Date}start
         * @param {Date} end
         */
        static restoreAvailabilities(user, start, end) {
            console.info("AvailabilityService.restoreAvailabilities for user", user, " from", start, "to", end);
            var availabilities = user.availabilities;
            var previousAvailability, nextAvailability;

            //if exits, get direct previous availabilty
            var previousAvailabilityIndex = AvailabilityService.getIndexOfAvailabilityWhichEndWhenParamStart(user, start);

            //if exits, get direct next availabilty
            var nextAvailabilityIndex = AvailabilityService.getIndexOfAvailabilityWhichStartWhenParamEnd(user, end);


            //if possible

            //remove old availability(ies)
            if (typeof previousAvailabilityIndex !== "undefined") {
                previousAvailability = availabilities.splice(previousAvailabilityIndex, 1)[0];
            }
            if (typeof nextAvailabilityIndex !== "undefined") {
                nextAvailability = availabilities.splice(nextAvailabilityIndex, 1)[0];
            }

            var newAvailability = {};

            //merge availability
            if (previousAvailability) {
                newAvailability.start = previousAvailability.start;
            } else {
                newAvailability.start = start;
            }
            if (nextAvailability) {
                newAvailability.end = nextAvailability.end;
            } else {
                newAvailability.end = end;
            }

            availabilities.push(newAvailability);

            Users.update({_id: user._id}, {$set: {availabilities: availabilities}});

        }

        /**
         * @memberOf AvailabilityService
         * @summary Proxy for TimeSlotService.getTimeSlotByStart
         * @locus Anywhere
         * @param {Array<Availability>} availabilities
         * @param {Date}start
         * @return {timeSlot|null}
         */
        static getAvailabilityByStart(availabilities, start) {
            return TimeSlotService.getTimeSlotByStart(availabilities, start);
        }

        /**
         * @memberOf AvailabilityService
         * @summary Return true if user is available between start and end params.
         * @locus Anywhere
         * @param {Array<Availability>} availabilities
         * @param {Date}start
         * @param {Date} end
         * @return {boolean}
         */
        static checkUserAvailabilty(user, start, end) {
            console.info("AvailabilityService.checkUserAvailabilty for user", user, " from", start, "to", end);
            var availabilities = user.availabilities;

            var availabilityIndex = AvailabilityService.getIndexOfSurroundingAvailability(user, start, end);

            if (availabilityIndex == null) {
                return false;
            }
            return true;


        }
    }
