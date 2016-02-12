

ServerTaskService =
    class ServerTaskService {

        static allowInsert(userId, doc){
            SecurityServiceServer.grantAccessToItem(userId,RolesEnum.TASKWRITE, doc,'task');
        }

        static allowUpdate(userId, doc, fieldNames, modifier, options){
            SecurityServiceServer.grantAccessToItem(userId,RolesEnum.TASKWRITE, doc,'task');

            if(_.contains(fieldNames,"accessPassValidation"))
                SecurityServiceServer.grantAccessToItem(userId,RolesEnum.ACCESSPASSVALIDATION, doc,'task');

            if(_.contains(fieldNames,"assignmentValidation"))
                SecurityServiceServer.grantAccessToItem(userId,RolesEnum.ASSIGNMENTVALIDATION, doc,'task');

            if(_.contains(fieldNames,"equipmentValidation"))
                SecurityServiceServer.grantAccessToItem(userId,RolesEnum.EQUIPEMENTVALIDATION, doc,'task');
        }

        static allowDelete(userId, doc){
           SecurityServiceServer.grantAccessToItem(userId,RolesEnum.TASKDELETE, doc,'task');
        }
    }