

ServerTaskService =
    class ServerTaskService {

        static allowInsert(userId, doc){
            SecurityService.grantAccessToItem(userId,RolesEnum.TASKWRITE, doc,'task');

        }

        static allowUpdate(userId, doc, fieldNames, modifier, options){
            SecurityService.grantAccessToItem(userId,RolesEnum.TASKWRITE, doc,'task');

            if(_.contains(fieldNames,"accessPassValidation"))
                SecurityService.grantAccessToItem(userId,RolesEnum.ACCESSPASSVALIDATION, doc,'task');

            if(_.contains(fieldNames,"assignmentValidation"))
                SecurityService.grantAccessToItem(userId,RolesEnum.ASSIGNMENTVALIDATION, doc,'task');

            if(_.contains(fieldNames,"equipmentValidation"))
                SecurityService.grantAccessToItem(userId,RolesEnum.EQUIPEMENTVALIDATION, doc,'task');


        }

        static allowDelete(userId, doc){
           SecurityService.grantAccessToItem(userId,RolesEnum.TASKDELETE, doc,'task');

        }
    }