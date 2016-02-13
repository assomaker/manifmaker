

ServerTaskService =
    class ServerTaskService {

        static allowInsert(userId, doc){
            SecurityServiceServer.grantAccessToItem(userId,RolesEnum.TASKWRITE, doc,'task');
        }

        static allowUpdate(userId, doc, fieldNames, modifier, options){
            SecurityServiceServer.grantAccessToItem(userId,RolesEnum.TASKWRITE, doc,'task');

            if(_.contains(fieldNames,"accessPassValidation"))
                if(modifier.$set.accessPassValidation.currentState === ValidationState.TOBEVALIDATED)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKWRITE, doc, 'task');
                else
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ACCESSPASSVALIDATION, doc, 'task');

            if(_.contains(fieldNames,"assignmentValidation")) {
                if(modifier.$set.assignmentValidation.currentState === ValidationState.TOBEVALIDATED)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKWRITE, doc, 'task');
                else
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.ASSIGNMENTVALIDATION, doc, 'task');
            }

            if(_.contains(fieldNames,"equipmentValidation"))
                if(modifier.$set.equipmentValidation.currentState === ValidationState.TOBEVALIDATED)
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.TASKWRITE, doc, 'task');
                else
                    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.EQUIPMENTVALIDATION, doc, 'task');

            if(_.contains(fieldNames,"timeSlots")){
                if(doc.timeSlotValidation.currentState !== ValidationState.OPEN && doc.timeSlotValidation.currentState !== ValidationState.REFUSED){
                    throw new Meteor.Error("403","Can't update task time slot data if task is not open or refused");
                }
            }
        }

        static allowDelete(userId, doc){
           SecurityServiceServer.grantAccessToItem(userId,RolesEnum.TASKDELETE, doc,'task');
        }
    }