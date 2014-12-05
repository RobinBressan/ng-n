ngN [![Build Status](https://travis-ci.org/RobinBressan/ng-n.svg?branch=master)](https://travis-ci.org/RobinBressan/ng-n)
===============

Fully customizable notification module for your AngularJS application.

See demo: http://jsfiddle.net/RobinBressan/ege3gu9c

# Installation

It is available with bower:

```
bower install ng-n
```

Then add the retrieved files to your HTML layout:

```html
<script type="text/javascript" src="/path/to/bower_components/ng-n/ng-n.min.js"></script>
```

You can also use it with [RequireJS](http://requirejs.org/) as an AMD module.

Then add `ngN` as dependency for your AngularJS application:

```javascript
var app = angular.module('YOUR_APP', ['ngN']);
```

# Usage

To build a notification simply use `$n` factory:

```javascript
var notification = $n({ title: 'Success', content: 'It works!'});

// You can configure it before display it
notification
    .title('Error') // You can update the title
    .timeout(2000) // It will expire after 2000ms
    .save(); // We save the notification to display it

// Each property can be retrieved by calling the same function without argument
notification.title(); // Will return `Error`
```

In fact, we've used here `title` or `content` but you can use **whatever** you want:
```javascript
var notification = $n({ spaceship: 'Success' });

notification.spaceship(); // Will return `Success`
notification.spaceship('Info'); // Will set spaceship to `Info`
```

A notification always has some persistent methods:

* `on(event, callback)`: Add an event listener
* `trigger(event)`: Call all event listeners for a given event
* `kill()`: Mark the notification as expired
* `save()`: Save the notification. It means it will be displayed if not expired
* `timeout(time)`: Auto kill the notification when timeout ends

Furthermore you can give a delay to the `save` method:

```javascript
var notification = $n();

notification.save(3000); // Will be save in 3000ms
```

When a notification is saved, the `save` event is triggered. Same thing for `kill` method:

```javascript

var notification = $n();

notification
    .on('save', function() {
        storeToDatabase();
    })
    .on('kill', function() {
        removeFromDatabase();
    });

// You can also define you own events

notification
    .on('something', function() {
        console.log('something happens');
    })
    .trigger('something');
```

## Custom notification factories

You can also create a custom `$n` factory by using `$n.extend`:

```javascript
var customN = $n.extend({ title: 'default title'});

var notification = customN(); // notification has now a `title` method
```

Or better idea:

```javascript
var withContent = $n.extend({ content: '' });

var info = withContent.extend({ title: 'Info' });
var success = withContent.extend({ title: 'Success' });
var error = withContent.extend({ title: 'Error' });

// Let's display an information
info().content("What's up").save();

// Or an error
error().content('Oups').save();

// And a success
success().content('You did it!').save();
```

And what about registering this custom factories in angular DI? Let's do it:

```javascript
var app = angular.module('myApp', ['ngN']);

app.factory('withContent', ['$n', function($n) {
    return $n.extend({ content: ''});
}]);

app.factory('info', ['withContent', function(withContent) {
    return withContent.extend({ title: 'Info' });
}]);

app.factory('error', ['withContent', function(withContent) {
    return withContent.extend({ title: 'Error' });
}]);

app.factory('success', ['withContent', function(withContent) {
    return withContent.extend({ title: 'Success' });
}]);
```

##### Notification stack

Since v1.2 you can group some notifications into a `stack`. A stack will be dispatch as a single notification but with a `flush` method to dispatch all its notifications:

```javascript
    var myStack = $n.stack();

    var notification1 = $n({ content: 'I am stacked!'});
    myStack.push(notification1);

    var notification2 = $n({ content: 'I am stacked too!'});
    myStack.push(notification2);

    // The stack contains two notification. To create the stacked notification just call it as a function
    myStack()
        .timeout(5000)
        .save();
```

A stack exposes two new methods:

* `size()`: Return a the notification count stored into the stack
* `flush()`: Dispatch all notifications stored into the stack and empty it

When a stacked notification is flushed, the `flush` event is triggered:

```javascript

myStack
    .on('flush', function() {
        markAsRead();
    });
```

To handle display for a stack, see [Display the notifications](#display-the-notifications).

#### Display the notifications

To display the notifications you have to use the `n-view` directive:

```html
<n-view>
    <!-- You can define your notification template here.
        It will be used for each notification available -->

    <!--`notification` targets the current one -->
</n-view>
```

For example you can do:

```html
<n-view>
    <div class="alert">
        <h4>{{ notification.title() }}</h4>
        <p>
            {{ notification.content() }}
            <a ng-click="notification.kill()">Close</a>

            <!-- You can add a listener on this `cancel` event by using `on` method on your notification definition -->
            <!-- This way you are free to add any custom behaviour! -->
            <a ng-click="notification.trigger('cancel').kill()">Cancel</a>
        </p>
    </div>
</n-view>
```

Or maybe using the bootstrap angular-ui `alert` directive:

```html
<n-view>
    <alert type="{{ notification.type() }}" close="notification.kill()">{{ notification.content() }}</alert>
</n-view>
```

You can also use a `ng-include` directive inside a `ng-view`:

```html
<n-view>
    <ng-include src="'template.html'"></ng-include>
</n-view>
```

##### Display a stacked notification

A stacked notification is displayed the same way than a classic notification. You can detect it by checking if the `flush` method is defined:

```html
<n-view>
    <div class="alert" ng-if="!notification.flush">
        <h4>{{ notification.title() }}</h4>
        <p>
            {{ notification.content() }}
            <a ng-click="notification.kill()">Close</a>

            <!-- You can add a listener on this `cancel` event by using `on` method on your notification definition -->
            <!-- This way you are free to add any custom behaviour! -->
            <a ng-click="notification.trigger('cancel').kill()">Cancel</a>
        </p>
    </div>
    <div class="alert" ng-if="!notification.flush">
        <!-- We are in a stacked notification -->
        <h4>{{ notification.size() }} notifications</h4>
        <p>
            <!-- You can display all notifications in the stack by calling the `flush` method -->
            <a ng-click="notification.flush()">Show all</a>
            <a ng-click="notification.kill()">Close</a>
        </p>
    </div>
</n-view>
```

Build
------

To rebuild the minified JavaScript you must have `requirejs` installed globally and run: `make build`.

Tests
-----
Install dependencies and run the unit tests:

```
make install
make test-spec
```

Contributing
------------

All contributions are welcome and must pass the tests. If you add a new feature, please write tests for it.

License
-------

This application is available under the MIT License.
