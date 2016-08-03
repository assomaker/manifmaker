<a name="Route"></a>

## Route : <code>object</code>
**Kind**: global namespace  

* [Route](#Route) : <code>object</code>
    * [.common](#Route.common) : <code>object</code>
        * [.home  /](#Route.common.home  /)
        * [.demo-select  /demo-select](#Route.common.demo-select  /demo-select)
        * [.inject-data  /inject-data](#Route.common.inject-data  /inject-data)
        * [.home  /delete-all](#Route.common.home  /delete-all)
        * [.init-access-right-data  /init-access-right-data](#Route.common.init-access-right-data  /init-access-right-data)
        * [.populate-data  /populate-data](#Route.common.populate-data  /populate-data)
    * [.Task](#Route.Task) : <code>object</code>
        * [.home  /tasks](#Route.Task.home  /tasks)
        * [.task.create  /task](#Route.Task.task.create  /task)
        * [.task.read  /task/:_id](#Route.Task.task.read  /task/__id)
        * [.task.read  /task/:_id](#Route.Task.task.read  /task/__id)
        * [.task.validation.timeSlot  /task/validation/:validationType/:_id/:state](#Route.Task.task.validation.timeSlot  /task/validation/_validationType/__id/_state)
    * [.User](#Route.User) : <code>object</code>
        * [.user.list  /users](#Route.User.user.list  /users)
        * [.user.create  /user](#Route.User.user.create  /user)
        * [.user.read  /user/:_id](#Route.User.user.read  /user/__id)
        * [.user.read  /user/:_id](#Route.User.user.read  /user/__id)
        * [.logout  /logout](#Route.User.logout  /logout)

<a name="Route.common"></a>

### Route.common : <code>object</code>
**Kind**: static namespace of <code>[Route](#Route)</code>  

* [.common](#Route.common) : <code>object</code>
    * [.home  /](#Route.common.home  /)
    * [.demo-select  /demo-select](#Route.common.demo-select  /demo-select)
    * [.inject-data  /inject-data](#Route.common.inject-data  /inject-data)
    * [.home  /delete-all](#Route.common.home  /delete-all)
    * [.init-access-right-data  /init-access-right-data](#Route.common.init-access-right-data  /init-access-right-data)
    * [.populate-data  /populate-data](#Route.common.populate-data  /populate-data)

<a name="Route.common.home  /"></a>

#### common.home  /
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Home  
**Locus**: client  
<a name="Route.common.demo-select  /demo-select"></a>

#### common.demo-select  /demo-select
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Demo du custom select  
**Locus**: client  
<a name="Route.common.inject-data  /inject-data"></a>

#### common.inject-data  /inject-data
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Inject Dada (remove all before)  
**Locus**: client  
<a name="Route.common.home  /delete-all"></a>

#### common.home  /delete-all
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Delete all DB data  
**Locus**: client  
<a name="Route.common.init-access-right-data  /init-access-right-data"></a>

#### common.init-access-right-data  /init-access-right-data
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Inject some authent profil (admin/admin and others)  
**Locus**: client  
<a name="Route.common.populate-data  /populate-data"></a>

#### common.populate-data  /populate-data
**Kind**: static property of <code>[common](#Route.common)</code>  
**Summary**: Add some data test (some conf, 3 tasks)  
**Locus**: client  
<a name="Route.Task"></a>

### Route.Task : <code>object</code>
**Kind**: static namespace of <code>[Route](#Route)</code>  

* [.Task](#Route.Task) : <code>object</code>
    * [.home  /tasks](#Route.Task.home  /tasks)
    * [.task.create  /task](#Route.Task.task.create  /task)
    * [.task.read  /task/:_id](#Route.Task.task.read  /task/__id)
    * [.task.read  /task/:_id](#Route.Task.task.read  /task/__id)
    * [.task.validation.timeSlot  /task/validation/:validationType/:_id/:state](#Route.Task.task.validation.timeSlot  /task/validation/_validationType/__id/_state)

<a name="Route.Task.home  /tasks"></a>

#### Task.home  /tasks
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Display tasks list  
**Locus**: client  
<a name="Route.Task.task.create  /task"></a>

#### Task.task.create  /task
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Display the create task form without time slots and validation workflow  
**Locus**: client  
<a name="Route.Task.task.read  /task/__id"></a>

#### Task.task.read  /task/:_id
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Display the task update form by it's MongoId  
**Locus**: client  

| Param |
| --- |
| taskId | 

<a name="Route.Task.task.read  /task/__id"></a>

#### Task.task.read  /task/:_id
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Display the task in read mode by it's MongoId  
**Locus**: client  

| Param |
| --- |
| taskId | 

<a name="Route.Task.task.validation.timeSlot  /task/validation/_validationType/__id/_state"></a>

#### Task.task.validation.timeSlot  /task/validation/:validationType/:_id/:state
**Kind**: static property of <code>[Task](#Route.Task)</code>  
**Summary**: Update validation state for one the task part  
**Locus**: client  

| Param |
| --- |
| validationType | 
| taskId | 
| validationState | 

<a name="Route.User"></a>

### Route.User : <code>object</code>
**Kind**: static namespace of <code>[Route](#Route)</code>  

* [.User](#Route.User) : <code>object</code>
    * [.user.list  /users](#Route.User.user.list  /users)
    * [.user.create  /user](#Route.User.user.create  /user)
    * [.user.read  /user/:_id](#Route.User.user.read  /user/__id)
    * [.user.read  /user/:_id](#Route.User.user.read  /user/__id)
    * [.logout  /logout](#Route.User.logout  /logout)

<a name="Route.User.user.list  /users"></a>

#### User.user.list  /users
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Display the user list with filter and search  
**Locus**: client  
<a name="Route.User.user.create  /user"></a>

#### User.user.create  /user
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Display the create user form  
**Locus**: client  
<a name="Route.User.user.read  /user/__id"></a>

#### User.user.read  /user/:_id
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Display the user update form by it's MongoId  
**Locus**: client  

| Param |
| --- |
| userId | 

<a name="Route.User.user.read  /user/__id"></a>

#### User.user.read  /user/:_id
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Display the user in read mode by it's MongoId  
**Locus**: client  

| Param |
| --- |
| userId | 

<a name="Route.User.logout  /logout"></a>

#### User.logout  /logout
**Kind**: static property of <code>[User](#Route.User)</code>  
**Summary**: Logout usser  
**Locus**: client  
