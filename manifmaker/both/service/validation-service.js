ValidationService =
    class ValidationService {


        /**
         * @memberOf ValidationService
         * @summary Add a new comment and update validation status of a given task. Does't do any security check as we can basically reach every state from every state
         * @locus Anywhere
         * @param taskId
         * @param validationStateAsked
         * @param validationType
         * @param comment
         */
        static updateValidation(taskId, validationStateAsked, validationType, comment) {
            var task = Tasks.findOne(taskId);
            var validationState = task[validationType];

            var now = new Date();
            validationState.comments.push({
                author: "Moi",
                content: comment,
                creationDate: now,
                stateBefore: validationState.currentState,
                stateAfter: validationStateAsked
            });
            validationState.currentState = ValidationStateUrl[validationStateAsked];
            validationState.lastUpdateDate = now;


            switch (validationType){
                case ValidationTypeUrl["time-slot"]:
                    Tasks.update({_id: task._id}, {$set: {timeSlotValidation: validationState}});
                    break;
                case ValidationTypeUrl["access-pass"]:
                    Tasks.update({_id: task._id}, {$set: {accessPassValidation: validationState}});
                    break;
                case ValidationTypeUrl["equipment"]:
                    Tasks.update({_id: task._id}, {$set: {equipmentValidation: validationState}});
                    break;
            }

        }

    }