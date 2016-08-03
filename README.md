demo : http://assomaker.leomartinez.fr/
doc : http://assomaker.leomartinez.fr:8080/


# Installation

* install meteor itself : https://www.meteor.com/install
* fetch this repo
```bash
git clone https://github.com/assomaker/manifmaker.git
```
* go into the folder with a .meteor directory in it (this is the app)
```bash
cd PATH_TO_REPO/manifmaker
```
* launch the framework who will first download all the dependencies (once for all), run MongoDB and run the app itself
```bash
meteor
```
* once Meteor started, you can visit the app : localhost:3000
* click on "inject data" on the main page or visit localhost:3000/inject-data

> Windows User : you need to install[Git](https://git-scm.com/)if you don't already have it

> Windows User : if Meteor is not a known command, add meteor to your path. Meteor binary can be found here C:\Users\YOU\AppData\Local\.meteor
>
>[Edit Windows path](http://www.computerhope.com/issues/ch000549.htm)


# JSDoc

## HTML
[JSDoc Github](https://github.com/jsdoc3/jsdoc)

```bash
npm install jsdoc -g
npm run doc:html
```

Open doc/html/index.html in a browser. 


## Markdown

[doc jsdoc-to-markdown](https://www.npmjs.com/package/jsdoc-to-markdown)

```bash
npm install jsdoc-to-markdown --save-dev
npm run doc:md
```

Generated in /doc/markdown

# Testing

## Writing test

Tests are located in three directories named "test" in /both, /client and /server. Tests in /both contains "B : " in their description. 

They are based on Mocha (testing) and Chai (asserting) and user full app mode meaning that you can do whatever you want without mocking anything. 
The BDD is up as well as everything else. 

## Browser report

``` bash
npm run test:watch 
```

Visit localhost:3020 to run tests and see the test report. The test are automatically re-run if code changes. 


## CLI report (CI usage)
dispatch:mocha-phantomjs et practicalmeteor:mocha ne peuvent pas bosser ensemble, en attente qu'ils resolvent ca pour faire la CI

"test:ci": "SERVER_TEST_REPORTER='list' CLIENT_TEST_REPORTER='list' meteor test --once --full-app --driver-package dispatch:mocha-phantomjs",


# Staging 

Coming soon : whenever a merge request is made against branch deploy, a Docker somewhere runs automatic tests and gives feedback to allow or not the MR

# Deploy

Using Webhooks, each push on branch deploy triggers a _git pull_ on a machine where Meteor is run in dev mode (auto-restart if server code changes, auto refresh is client code changes)

[http://assomaker.leomartinez.fr](http://assomaker.leomartinez.fr)

(ask[Rémi](https://github.com/remipichon)or[Léo](https://github.com/martinezleoml)to gain access on the machine, only with key auth)

# Contribution

Usual merge request stuff

Coming soon : branch deploy is locked, only MR can push to it

# Teckos Documentation

## Data test
In dev mode, from the home page you can inject data or use URL to do so :
* /inject-data : delete everything and inject auth profiles to log in as well as some conf and data.

Details regarding authentication data can be found here :

* role : \both\collection\model\enum\RolesEnum.js
* groupRole : see InjectDataServerService._injectGroupRoles
* user : see InjectDataServerService.initAccessRightData
  * admin/admin
  * hard/hard
  * user1/user1


## Security

Access Right verification : 

* client side : Iron.Router routes
* server side :
  * read : for each collection, in publish method : /server/server-collection
  * write : for each collection, in allow/deny that (insert/update/delete) : /server/main.js see "allow/deny policies"

## Data integrity

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

## Material design icon


``` html
<i class="mdi mdi-home"></i>
```

Icon definition can be found here : [https://materialdesignicons.com/](https://materialdesignicons.com/). 

## How to use home-made stuff

### CustomSelect

Refer to the auto-generated doc : [select-component.md](https://github.com/assomaker/manifmaker/blob/bye_bye_materializecss/doc/markdown/select-component.md)

and the live demo : [/demo-select](localhost:3000/demo-select)


### Add a reference collection

Add the schema to /both/collection/schema/schema-references.js (to create Schema and Mongo Collection and generatares every needed routes)

* PLURAL_REFERENCE_URL : url for the list (GET)
* REFERENCE_URL: url to create (POST), update and delete
* REFERENCE_COLLECTION_NAME: Mongo Variable Collection name
* REFERENCE_MONGO_COLLECTION_NAME: Collection Name in MongoDb
* REFERENCE_LABEL: How the collection will be named in html
* TEMPLATE_ROW: the template to render one row of the list


See Schemas.references.Teams for a minimal collection reference example. 


If you want to reference one of the users references collections, you should add a field like name as :

CollectionName_Id  : eg  EquipmentCategories_Id 

It will display the "name" field of the references collection in the list

Basic references field with custom verification that the _id actually exists and autoform to generate the dropdown

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



 
Please note that you need to add the following fields to have the "update" button working (sorry...)

baseUrl: { 
        type: String,
        label: "Team base URL",
        defaultValue: "team"
}


Please note that you need to add the following fields to have the "remove" button working (sorry...)

 type: { 
        type: String,
        label: "Teams type",
        defaultValue: "Teams"
    },


Add the newly created Mongo Collection to the AllCollections array in /client/routes/config/route-collection-references.js
(can't be put in another place as this project don't have any dependency manager)


Add your specific template to each of the files in /client/templates/references/ (just copy/paste and update the existing templates to your needs. Be careful with
singular and plural to have everything correctly generated)

* insert.html : template to create a new reference document
* update.html :  template to update a reference document


and add your new Collection to publish/subscribe policy


You should follow the current populate/clean policy




