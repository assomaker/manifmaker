<a name="SelectComponent"></a>

## SelectComponent
**Kind**: global class  

* [SelectComponent](#SelectComponent)
    * [new SelectComponent#initializeData()](#new_SelectComponent_new)
    * [.optionCollection](#SelectComponent+optionCollection)
    * [.optionCollectionIndex](#SelectComponent+optionCollectionIndex)
    * [.optionValueName](#SelectComponent+optionValueName) : <code>string</code>
    * [.updateCollection](#SelectComponent+updateCollection)
    * [.updateItemId](#SelectComponent+updateItemId) : <code>mongoId</code>
    * [.updateItemPath](#SelectComponent+updateItemPath)
    * [.pathWithArray](#SelectComponent+pathWithArray)
    * [.updateCallback](#SelectComponent+updateCallback) : <code>function</code>
    * [.quickSelectLabel](#SelectComponent+quickSelectLabel) : <code>String</code>
    * [.quickSelectId](#SelectComponent+quickSelectId) : <code>MongoId</code>
    * [.quickSelectIds](#SelectComponent+quickSelectIds) : <code>Array.&lt;MongoId&gt;</code>
    * [.title](#SelectComponent+title) : <code>string</code>
    * [.selectLabel](#SelectComponent+selectLabel) : <code>string</code>
    * [.filterPlaceHolder](#SelectComponent+filterPlaceHolder) : <code>string</code>
    * [.nothingSelectedLabel](#SelectComponent+nothingSelectedLabel) : <code>string</code>
    * [.withoutLabel](#SelectComponent+withoutLabel) : <code>boolean</code>
    * [.maxSelectedOptionDisplayed](#SelectComponent+maxSelectedOptionDisplayed) : <code>number</code>
    * [.maxSelectedOptionDisplayedLabel](#SelectComponent+maxSelectedOptionDisplayedLabel) : <code>string</code>
    * [.selectedOptionSortedOnTopOfList](#SelectComponent+selectedOptionSortedOnTopOfList) : <code>boolean</code>

<a name="new_SelectComponent_new"></a>

### new SelectComponent#initializeData()
A demo should be available in development mode at /demo-select. The corresponding code is at /client/templates/demo-select.html

This set a component provide a powerful select whose features are :
* update directly anything in a collection
* let you do whatever you want using a callback
* searchable options
* sortable options
* many more...

SelectComponent is not designed to be used as it, you should use one of the following component :
- SingleSelectComponent
- SingleNonMandatorySelectComponent
- MultipleSelectComponent
- MultipleNonMandatorySelectComponent

NonMandatory offer a button to remove all selected option
SingleSelect allow to select ONE option while MultipleSelect allow to select ANY option.

Here is the simplest example :
``` html
 {{> MultipleSelectComponent selectLabel="Multiple select with mininum params to update an item in a collection"
          optionCollection="Teams" optionValueName="name" optionCollectionIndex="TeamsIndex"
          updateCollection="Users" updateItemId=user1Id updateItemPath="teams"
  }}
```

There is two main kind of params. The ones telling what will be the options to be selected and the ones explaining what to do once options
have been selected.

To define the options selectable you need : optionCollection, optionValueName and optionCollectionIndex.
To explain what to do after user actions : updateCollection, updateItemId, updateItemPath OR provide only an updateCallback.

Refers to following docs to have an explanation of each option.

You also have several other options to customize your select :
* maxSelectedOptionDisplayed
* selectedOptionSortedOnTopOfList
* withoutLabel
* quickSelectIds/quickSelectId
* all label are customizable and offer a default value inferred from other mandatory params

<a name="SelectComponent+optionCollection"></a>

### selectComponent.optionCollection
Mongo Collection in the window scope(findAll will be used) OR array (array is not implemented yet)
Les options du select

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: required  
<a name="SelectComponent+optionCollectionIndex"></a>

### selectComponent.optionCollectionIndex
EasySearch.Index instance in the window scope

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: required if optionCollection is a Collection Mongo  
<a name="SelectComponent+optionValueName"></a>

### selectComponent.optionValueName : <code>string</code>
MongoDb field of the option label to be displayed (in the selectable list in the popover and the list displaying
the selected options

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: required if optionCollection is a Collection Mongo  
<a name="SelectComponent+updateCollection"></a>

### selectComponent.updateCollection
Mongo Collection in the window scope

Mongo Collection from which an item will be automacally updated when select changes.
If not provided, you should use an updateCallback to handle yourself whatever you want to do with the custom select.

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
<a name="SelectComponent+updateItemId"></a>

### selectComponent.updateItemId : <code>mongoId</code>
_id of the item to be updated (need to be in updateCollection, of course)

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: required if updateCollection is provided  
<a name="SelectComponent+updateItemPath"></a>

### selectComponent.updateItemPath
dot path to nested field to be updated

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: required if updateCollection is provided and pathWithArray is not  
<a name="SelectComponent+pathWithArray"></a>

### selectComponent.pathWithArray
key value object

JSON object to update a nested field which is itself in an array of object with an unique _id.
See optionsToUpdate for more information

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: required if updateCollection is provided and updateItemPath is not  
<a name="SelectComponent+updateCallback"></a>

### selectComponent.updateCallback : <code>function</code>
important : your callback should return a function. Blaze is made to evaluate everything that is given to him, a callback has
 to be have this form :
 ``` javascript
  myUpdateCallback(error, docModified, newOption) {
         return _.bind(function(error, docModified, newOption) {
             //do something with newOption which is a MongoId if SingleSelect or an array of MongoId if MultipleSelect
         },this);
  }
 ```

 Called with an error object as the first argument and, if no error, the number of affected documents as
 the second and an array of the selected options as the third.
 Required if updateCollection is not provided but can be used even if updateCollection is provided

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: required if updateCollection is not provided  
<a name="SelectComponent+quickSelectLabel"></a>

### selectComponent.quickSelectLabel : <code>String</code>
If nothing is selected, allow user to quickly select predefined option(s) without opening the popover
If defined, either quickSelectId (SingleSelect) or quickSelectIds (MultipleSelect) should be defined.

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
<a name="SelectComponent+quickSelectId"></a>

### selectComponent.quickSelectId : <code>MongoId</code>
**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: Required if quickSelectLabel is defined. Works on a SingleSelect only.  
<a name="SelectComponent+quickSelectIds"></a>

### selectComponent.quickSelectIds : <code>Array.&lt;MongoId&gt;</code>
**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: Required if quickSelectLabel is defined. Works on a MultipleSelect only.  
<a name="SelectComponent+title"></a>

### selectComponent.title : <code>string</code>
**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Default**: <code>&quot;: \&quot;Update \&quot; + optionCollection&quot;</code>  
**Sumamry**: Popover title  
<a name="SelectComponent+selectLabel"></a>

### selectComponent.selectLabel : <code>string</code>
**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: Label of the select component (not the popover title)  
**Default**: <code>&quot;: title&quot;</code>  
<a name="SelectComponent+filterPlaceHolder"></a>

### selectComponent.filterPlaceHolder : <code>string</code>
**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: Search input text placeholder  
**Default**: <code>&quot;\&quot;Filter by\&quot; + optionValueName&quot;</code>  
<a name="SelectComponent+nothingSelectedLabel"></a>

### selectComponent.nothingSelectedLabel : <code>string</code>
**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Default**: <code>&quot;: Nothing yet selected&quot;</code>  
<a name="SelectComponent+withoutLabel"></a>

### selectComponent.withoutLabel : <code>boolean</code>
**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: compact form where selectLabel is not used  
**Default**: <code>false</code>  
<a name="SelectComponent+maxSelectedOptionDisplayed"></a>

### selectComponent.maxSelectedOptionDisplayed : <code>number</code>
Number of selected options displayed. If -1, all selected options are displayed. If 0, so selected options are displayed. Else, if more than
maxSelectedOptionDisplayed options are selected, a count is displayed with maxSelectedOptionDisplayedLabel.

Note : Any value greater than 0 are unless if the component is a SingleSelectComponent as no more than one selected options will ever be displayed.

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Default**: <code>-1</code>  
<a name="SelectComponent+maxSelectedOptionDisplayedLabel"></a>

### selectComponent.maxSelectedOptionDisplayedLabel : <code>string</code>
label to display if maxSelectedOptionDisplayed is reached. Number of selected options will be added
ad the beginning of the string.

**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Default**: <code>&quot;optionCollection + \&quot; selected\&quot;&quot;</code>  
<a name="SelectComponent+selectedOptionSortedOnTopOfList"></a>

### selectComponent.selectedOptionSortedOnTopOfList : <code>boolean</code>
**Kind**: instance property of <code>[SelectComponent](#SelectComponent)</code>  
**Summary**: If true, selected options are on top of the popover list  
**Default**: <code>false</code>  
