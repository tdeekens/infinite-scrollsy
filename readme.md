# Infinite-Scrollsy

It is a module for [AngularJS](http://angularjs.org/) which allow you to attach an event handler to the element when this element
has been scrolled almost to its bottom. In most of the case it will be used for infinite scrolling.

## Why Infinite-Scrollsy and reasoning

I know at least five directives solving the problem of infinite scrolling so I feel an argument on why I felt the necessity to build another one should be made.

### No external dependencies

Infinite-Scrollsy does not have any dependency other than jQuery as some other libraries do.

### Performant throttling and external control

Infinite-Scrollsy has multiple options to allow the outer scope throttle or break out of its internal computations. It can be idled or halted after invoking the handler for a specific amount of time.

It's also performant in handling the scroll event being triggered at a rapid pace by debouncing it's internal event handler.

### DOM encapsulation

Infinite-Scrollsy solely performs measurements on internal elements not depending on the window or documents sizing. Still it takes it's the browser window's size into account when demanded.

## Documentation

The following section gives a brief outline on how to configure the directive in your setup.

### Isolated scope:

- infinite-scrollsy-handler (passed as &)
   - Callback triggered when scrolling conditions hold
- infinite-scrollsy-skip (passed as =)
   - A boolean causing breaking early out of any
     calculations not causing scrolling callback invocation.
     Useful to to skip loading while loading is in progress!

### Attributes:

- infinite-scrollsy-throttle (Default 100ms)
   - Time based throttling of scrolling
- infinite-scrollsy-idle (Default 100ms)
   - Idle time between invocations of handler
     to not burst fire on handler
- infinite-scrollsy-distance (Default 500px)
   - Distance at which scrolling on $scope will be
     triggered
- infinite-scrollsy-flex (None by default)
   - If set the window innerHeight will be used as
     a base reference for the scroll trigger causing
     the distance being window.innerHeight - distance

### Example in Html

```html
  <div
   infinite-scrollsy
   infinite-scrollsy-handler="fetchMore()"
   infinite-scrollsy-skip="isLoading"
   infinite-scrollsy-throttle='200'
   infinite-scrollsy-distance='1000'
   infinite-scrollsy-idle='500'
   infinite-scrollsy-flex='true'
  ></div>
```
