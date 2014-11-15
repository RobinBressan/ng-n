ngN [![Build Status](https://travis-ci.org/RobinBressan/ng-n.svg?branch=master)](https://travis-ci.org/RobinBressan/ng-n)
===============

Fully customizable notification module for your AngularJS application.

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

Furthermore you can give a delay to the `save` method:

```javascript
var notification = $n();

notification.save(3000); // Will be save in 3000ms
```

When a notification is saved, the `save` event is triggered. Same thing for `kill` method.

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