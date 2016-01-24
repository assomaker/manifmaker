ValidationService =
    class ValidationService {


        static updateValidation(taskId, validationStateAsked, validationType) {
            var task = Tasks.findOne(taskId);
            var validationState = task[validationType];
            //TODO check workflow

            var now = new Date();
            validationState.currentState = ValidationStateUrl[validationStateAsked];
            validationState.lastUpdateDate = now;
            validationState.comments.push({
                author: "Moi",
                content: "!!!!!!!!!",
                creationDate: now
            });

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