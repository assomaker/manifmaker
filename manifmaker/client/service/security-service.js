SecurityServiceClient =
    class SecurityServiceClient {


        static grantAccessToPage(userId, neededRole,page) {
            if (!Roles.userIsInRole(userId, neededRole))
                throw new Meteor.Error("403", `Can't access page ${page}, user don't have access right`);
        }

    }

