
Add a reference collection
===========================

Add the schema to /both/collection/schema/schema-references.js

Add the newly created Mongo Collection to the AllCollections array in /both/collection/both-collection.js

Add the specs to create routes in /client/routes/config/route-collection-references.js

* PLURAL_REFERENCE_URL : url for the list (GET)
* REFERENCE_URL: url to create (POST), update and delete
* REFERENCE_COLLECTION_NAME: Mongo Variable Collection name
* REFERENCE_MONGO_COLLECTION_NAME: Collection Name in MongoDb
* REFERENCE_LABEL: How the collection will be named in html
* TEMPLATE_ROW: the template to render one row of the list


Add your specific template to each of the files in /client/templates/references/

* insert.html : template to create a new reference document
* list.html : template to display the list of the reference collection
* update.html :  template to update a reference document


and add your new Collection to publish/subscribe policy



file watchers
======
https://github.com/thomasfl/filewatcher

filewatcher '**/*.js' 'echo buidling docs; meteor-jsdoc build'
