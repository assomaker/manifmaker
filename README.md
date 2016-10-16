# ManifMaker

##### What is for ?

ManifMaker is a single page web app aimed to plan and organize events where volunteers take a great part. 

In a few words, users create _tasks_ describing the job to be done, add _time slot_ defining when the _task_ has to be done and specify _people needs_ to explicit how many and what kind of volunteers are needed to perform the _task_.

Volunteers register on the app and add a few _availabilities_ and _skills_ to detail when they want to work and what can they do.  

Once tasks and their needs are validated, users assign volunteers to tasks according :

* match between  _task's time slots_ and _user's availabilities_ 
* match between _time slot's people needs_ and _user's skills_. 

## Live Demo
You can find a live demo [here](http://151.80.59.178:32783/). 

* login: superadmin
* password: superadmin

### Table of Contents
* [Installation](#installation)
* [Dev tools](#dev-tools)
  * [Quality](#quality)
    * [Auto generated Doc](#doc)
    * [Testing](#testing)
    * [Continuous Deployment](#cd)
    * [Production](#production)
  * [Design and UI tools](#ui-tools)
    * [Material design icon](#mdi)
    * [Alert](#alert)
    * [Confirm](#confirm)
    * [Custom Select](#custom-select)
  * [Data management](#data)
    * [Add a reference collection](#reference)



<a id="installation" name="installation"></a>
# Installation

The project relies on [Meteor](https://www.meteor.com/), a full stack single page app framework with real time capabilities.

* install meteor itself : https://www.meteor.com/install
* fetch this repo
```bash
git clone https://github.com/assomaker/manifmaker.git
```
* go into the folder with a .meteor directory in it (this is the app)
```bash
cd PATH_TO_REPO/app
```
* launch the framework who will first download all the dependencies (once for all), run MongoDB and run the app itself
```bash
meteor
```
* once Meteor started, you can visit the app : localhost:3000
* click on "inject data" on the main page or visit localhost:3000/inject-data

> Windows User : you need to install [Git](https://git-scm.com/) if you don't already have it

> Windows User : if Meteor is not a known command, add meteor to your path. Meteor binary can be found here C:\Users\YOU\AppData\Local\.meteor
>
>[Edit Windows path](http://www.computerhope.com/issues/ch000549.htm)


<a id="dev-tools" name="dev-tools"></a>
# Dev tools 
Dev tools already installed and to be used when implementing cool features.

<a id="quality" name="quality"></a>
## Quality

<a id="doc" name="doc"></a>
### Auto generated Doc 

[JSDoc](http://usejsdoc.org/) is used generate doc from annotations on code. The generated doc is available as Markdown in the repo [/doc/markdown](https://github.com/assomaker/manifmaker/tree/master/doc/markdown) or as HTML in the [stagging machine](http://151.80.59.178/doc).

The HTML doc is automatically build and deployed, see [Continuous Deployment](#cd) section. The Markdown doc has to be build and commit/push when it's relevant. 


#### HTML
[JSDoc Github](https://github.com/jsdoc3/jsdoc)

```bash
npm install jsdoc -g
npm run doc:html
```

> If you don't have npm globally installed, you can use the one provided by meteor. Add 'meteor' before npm command to do so.

Open doc/html/index.html in a browser. 


#### Markdown

[doc jsdoc-to-markdown](https://www.npmjs.com/package/jsdoc-to-markdown)

```bash
npm install jsdoc-to-markdown --save-dev
npm run doc:md
```

> If you don't have npm globally installed, you can use the one provided by meteor. Add 'meteor' before npm command to do so.


Generated in /doc/markdown

<a id="testing" name="testing"></a>
### Testing
There is no test frameworks.

<a id="cd" name="cd"></a>
### Continuous Deployment
[Travis CI](https://travis-ci.org/assomaker/manifmaker) is used to achieve Continuous Deployment. When a push occurs on branch _deploy_ : 
* ManifMaker app is builded as a Docker image and push to our [Docker hub repo](https://hub.docker.com/r/assomaker/manifmaker/).
* the new app is started in the stagging machine
* the HTML doc is build and deployed (available [here](http://151.80.59.178/doc))

#### Version management
app/package.json version is used to tag the Docker image. On the stagging machine there can be only one instance per version but several version can run at the same time. The [stagging index page](http://151.80.59.178/) provide links to all deployed version. 

Each version uses different Mongo user meaning that, while using the same Mongo instance, data are not shared and can be altered by each instance without disturbing the others. 

<a id="production" name="production"></a>
### Production
Not yet implemented, it will be on another machine. 

use ENV ISPROD to prevent using inject-data in prod

<a id="ui-tools" name="ui-tools"></a>
## Design and UI tools  

<a id="mdi" name="mdi"></a>
### Material design icon

``` html
<i class="mdi mdi-home"></i>
```

Icon definition can be found here : [https://materialdesignicons.com/](https://materialdesignicons.com/). 

<a id="alert" name="alert"></a>
### Alert

User friendly alerting use [s-alert](https://github.com/juliancwirko/meteor-s-alert). You basically only need 
##### Error

    sAlert.error('Your message');

##### Warning

    sAlert.warning('Your message');

##### Info

    sAlert.info('Your message');

##### Success

    sAlert.success('Your message');
    

Alert box will be displayed 2.5 seconds, if 'Your message' if too long to be read in 2.5 seconds you can override it with (in ms) :

##### Error

    sAlert.error('Your message',{ timeout : 60000 });


<a id="confirm" name="confirm"></a>
### Confirm and Prompt

[BootBox](http://bootboxjs.com/) has to be used to display a confirmation or a prompt box. 

```
 bootbox.confirm("Are you sure ?", function(result){
                if(result){
                    //user was sure
                }
            });
```

Do not use alert or custom dialog features as S-Alert is the preferred way. 


<a id="custom-select" name="custom-select"></a>
### CustomSelect
A powerfull custom selector is available. It is largely inspired by Github selector and provides following features :
* text search filter on options
* mandatory or not
* single or multiple select
* directly save in a field in database or
* call one of your callback when selection changes

You can refer to the auto-generated doc [select-component.md](https://github.com/assomaker/manifmaker/blob/master/doc/markdown/select-component.md) and the live demo : [/demo-select](http://151.80.59.178:32783/demo-select), or [localhost /demo-select](localhost:3000/demo-select)

<a id="data" name="data"></a>
## Data management 

<a id="reference" name="reference"></a>
### Add a reference collection

#### What is a reference collection ?

Reference collection are used when the user as a choice between a set of editable values. Typically, you will need a reference collection with form field using a Custom Select. All reference collection are editable in a page (/conf-maker) linkied to a role _CONFMAKER_. 

Each reference collection provides a set of features : 
* list all items from the page /conf-maker
  * create button
  * text search on one field 
* create form (with your specific fields)
* update form (with your specific fields, can be different that the create form)
* optionnaly add a reference to another collection 



#### define a schema

Add the schema to /both/collection/schema/CollectionReference.js. I will create Schema and Mongo Collection and generatares every needed routes)

* PLURAL_REFERENCE_URL : url for the list (GET)
* REFERENCE_URL: url to create (POST), update and delete
* REFERENCE_COLLECTION_NAME: Mongo Variable Collection name
* REFERENCE_MONGO_COLLECTION_NAME: Collection Name in MongoDb
* REFERENCE_LABEL: How the collection will be named in html
* TEMPLATE_ROW: the template to render one row of the list


See Schemas.references.Teams for a minimal collection reference example. 

Let's say you want a collection (eg: Equipment) to reference another reference collection (eg: EquipmentCategory) to allow a link between the two (eg : Equipement refers to a EquipmentCategory)
```
CollectionName_Id  : eg  EquipmentCategories_Id 
```
It will display the "name" field of the reference collection (eg: EquipmentCategory) in the insert/uptate form (eg:Equipment).

Basic references field with custom verification that the _id actually exists and autoform to generate the dropdown
```
# eg: EquipmentCategory contains a list of Equipment
EquipmentCategories_Id: {
        type: SimpleSchema.RegEx.Id,
        label: "Equipment Category",
        custom: function () {
            if (!EquipmentCategories.findOne(this.value))
                return "unknownId";
            return 1
        },
        autoform: {
            afFieldInput: {
                options: Schemas.helpers.allEquipmentCategoriesOptions
            }
        },
    },
```

#### some magic conf

 
Please note that you need to add the following fields to have the "update" button working (sorry...)
```
baseUrl: { 
        type: String,
        label: "Team base URL",
        defaultValue: "team"
}
```

Please note that you need to add the following fields to have the "remove" button working (sorry...)
```
 type: { 
        type: String,
        label: "Teams type",
        defaultValue: "Teams"
    },
```

#### configure routes

Add the newly created Mongo Collection to the AllCollections array in /client/routes/config/route-collection-references.js. 

#### some templates 

Add your specific template in /client/templates/references/ (just copy/paste and update the existing templates to your needs. Be careful with singular and plural to have everything correctly generated)

* insert.html : template to create a new reference document
* update.html :  template to update a reference document


#### publish and subscribe

and add your new Collection to publish/subscribe policy


You should follow the current populate/clean policy


#### tests
If everything went well :
* go to /conf-maker (with a user with _CONFMAKER_ role) : the list render and your new reference collection is here
* click on "create" or go to its REST POST route : insert form render
  * fill the form and submit it : submit works and you are redirected somewhere
  * the newly created iteam appears on your reference collection list (expand it from /conf-maker)
  * try to update an item : it should works

Keep on eye on the consoles (server and client) and fix all errors. 



#### Troubleshootings

Carefully check singular and plural and that your naming is similar to the existing (use Team as an example). 


<a id="data-test" name="data-test"></a>
### Data test

In dev mode, from the home page you can inject data or use URL to do so :
* /inject-data : delete everything and inject auth profiles to log in as well as some conf and data.

Details regarding authentication data can be found here :

* role : \both\collection\model\enum\RolesEnum.js
* groupRole : see app/server/services/InjectDataServerService._injectGroupRoles
* user : see app/server/services/InjectDataServerService.initAccessRightData
  * admin/admin
  * hard/hard
  * user1/user1

#### Prod

use ENV ISPROD to prevent using inject-data in prod

#### Super Admin user

A super admin user (superadmin/superadmin) is created at startup no matter what. This user has all existing roles, it can't be updated or removed and doesn't have to be used for anything else that injecting data (stagging) or create user with roles (production, at least one admin user with _ROLE_ role to add roles to other users). 

<a id="security" name="security"></a>
### Security

Access Right Security uses [alanning:roles](https://github.com/alanning/meteor-roles). 

Thw following verifications are done (and every new features should uses all these verifications) : 

* client side : Iron.Router routes 
``` Javascript
    SecurityServiceClient.grantAccessToPage(RolesEnum.TASKREAD);
```
* server side :
  * read : for each collection, in publish method : /server/server-collection
``` Javascript
    SecurityServiceServer.grantAccessToCollection(this.userId,RolesEnum.USERREAD,"users")
```
  * write : for each collection, in allow/deny that insert/update/delete : /server/service/ServerService.js
``` Javascript
    SecurityServiceServer.grantAccessToItem(userId, RolesEnum.USERWRITE, doc, 'user udpate');
```


### Data integrity


_Following is a long pamphlet about data, you don't normally want to read it_



Data validation is done inside the schemas (both/collection/model). Simple Schema provides common validations like date, string, int. Other 
validation can be done in custom methods with custom code to validate dates overlapping, fields updates according to validation state...

**If a single operation/action needs several atomic database update, all validation has to be done explicitly BEFORE updating the data.** 
If the validation is done one times (in the operation/action), no need to put it in the schema, just do it along with the action/operation. If not and you have to put
the validation in the schema and use pre validation from Simple Schema BEFORE updating any data. This way you ensure that the data updates will not fail. 

That is because of one thing : Meteor+MongoDB is not transactional. Indeed, if one of the database update fails because of a custom control that throws an error, the previous database updates will not be reverted and the following could occurs if you 
don't use a callback or manage the update return by yourself. 

Lets take two example : update an assignment term and perform an assignment : 

* an assignment term name has to be unique, the assignment start/end dates can not overlap with any other assignment term. When inserting/updating, the system has to assert all this.  
* a assignment has to verify several things :
  * the user is actually free during the time slot target time
  * the task time slot people need specs can be satisfied by the target user
  * the task is ready for assignment
  

Updating a assignment term uses ONE atomic database. An update on AssignmentTerms collection. The controls can be performed on the related schema without any side effects. If the 
requirements are not satisfied, the update will just fail and the error can be displayed to the user. 

Performing an assignment used THREE atomic database update (actually SIX but let's simplify the example) : 
* creating an assignment in Assignments collection
* updating user's availabilities
* updating task's time slot's people needed 
If one of the three update fails because of one the custom control in the schema, let's say the task was not ready for assignment. The two others DB updates will work (creating an
Assignment and update user's availabilities) resulting in not complete assignment : user will be assigned to the task but the task will not know that the user is assigned to her. 

(Let's cut it short : it could have been prevented by another data design where the assignment information is only store in one place (Assignments) instead of having the data copied in 
the Task and the User.)

From here, two philosophies to take into account whether you agree or not to : 
> "it's easier to ask forgiveness than it is to get permission"  which can be explained by "try to do it and if it fails, repair it"

When assigning, either you firstly check everything (user is available, task is ready, people need specs matches the user) and if it's ok, you perform the assignment or you perform the assignment and revert it if something failed. 
When choosing what to do you have to keep in mind that Meteor is real time, if you update something on the DB, it will be broadcasted to everyone subscribed. If you update something
and revert it right away, you will unefficiently use DDP, the clients will compute the data and probably display something for a short amount of time before the sytem reverts the changes.
It can lead the GUI to flickr. That is why it is probably better **to check everything BEFORE** database operations **if you need more than one database update** to perform one operation/action).



