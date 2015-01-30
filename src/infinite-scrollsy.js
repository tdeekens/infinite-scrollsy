;(function(ng, undefined) {
  var ngModule = ng.module('infiniteScrollsy', []);

  ngModule.directive('infiniteScrollsy', ['$timeout', '$window', function($timeout, $window) {
    /**
     * # How to use this thang
     *
     * ## Attributes:
     *  - infinite-scrollsy-throttle (Default 100ms)
     *     - Time based throttling of scrolling
     *  - infinite-scrollsy-idle (Default 100ms)
     *     - Idle time between invocations of handler
     *       to not burst fire on handler
     *  - infinite-scrollsy-distance (Default 500px)
     *     - Distance at which scrolling on $scope will be
     *       triggered
     *  - infinite-scrollsy-flex (None by default)
     *     - If set the window innerHeight will be used as
     *       a base reference for the scroll trigger causing
     *       the distance being window.innerHeight - distance
     *
     * ## Isolated scope;
     *  - infinite-scrollsy-handler (passed as &)
     *     - Callback triggered when scrolling conditions hold
     *  - infinite-scrollsy-skip (passed as =)
     *     - A boolean causing breaking early out of any
     *       calclations not causing scrolling callback invocation.
     *       Useful to to skip loading while loading is in progress!
     *
     * ## In Html
     *  <div
     *   infinite-scrollsy
     *   infinite-scrollsy-handler="fetchMore()"
     *   infinite-scrollsy-skip="isLoading"
     *   infinite-scrollsy-throttle='200'
     *   infinite-scrollsy-distance='1000'
     *   infinite-scrollsy-idle='500'
     *   infinite-scrollsy-flex='true'
     *  ></div>
     */
    return {
      restrict: 'A',
      scope: {
        handler: '&infiniteScrollsyHandler',
        skip: '=infiniteScrollsySkip'
      },
      link: function($scope, elem, attrs) {
        var
          _viewport = elem[0],
          _thresholds = {
            time: parseInt(attrs.infiniteScrollsyThrottle || 100, 10),
            scroll: parseInt(attrs.infiniteScrollsyDistance || 500, 10),
            idle: parseInt(attrs.infiniteScrollsyIdle || 100, 10),
            flex: attrs.infiniteScrollsyFlex ? $window.innerHeight : 0
          },
          _last = {
            scrollTop: null,
            invocation: null
          },
          _determineScrolling,
          _debounce,
          _invokeHandler;

        // Update scroll distance trigger to of flex minus scroll
        // if set by config
        if (_thresholds.flex) {
          _thresholds.scroll = _thresholds.flex - _thresholds.scroll;
        }

        _debounce = function(fn, threshhold) {
          threshhold = threshhold || 500;

          // Time of last call and timer id
          var last,
              deferTimer;

          // Wrapped and returned function
          return function() {
            // Current execution time and its arguments
            var
              now = +new Date(),
              args = arguments;

            // If condidion holds, execution will be
            // delayed and put on event loopsi with setTimeout
            // keeping track of resulting timer id
            // to potentially clear previous timeouts
            if (last && now < last + threshhold) {
              // Using timeout through angular's $window
              // but not using $timeout to not interfere
              // with digest cycles
              $window.clearTimeout(deferTimer);

              deferTimer = $window.setTimeout(function() {
                last = now;
                fn.apply(this, args);
              }, threshhold);
            // Last is now and apply is called on the passed in
            // fn executing it
            } else {
              last = now;
              fn.apply(this, args);
            }
          };
        };

        _determineScrolling = function() {
          // No scrolling if $scope decides not to
          if ($scope.skip) { return; }

          var
            // Return value indicating if scrolling will happen
            _shouldScroll = false,
            // Current position in scrolling process
            _position = _viewport.clientHeight + _viewport.scrollTop,
            // ...is height of element overall minus visible height and scroll top
            // taking a threshold into account
            _distance = _viewport.scrollHeight - _position;

          // Scroll if
          _shouldScroll = (
            // Not scrolling up
            _viewport.scrollTop > _last.scrollTop && (
              // distance to buttom surpasses the threshold
              _distance < _thresholds.scroll ||
              // or distance is below 0
              _distance <= 0
            ) &&
            // and enough time since last invocation passed
            (+new Date() - _last.invocation) >= _thresholds.idle
          );

          _last.scrollTop = _viewport.scrollTop;

          if (_shouldScroll) { _invokeHandler(); }
        };

        _invokeHandler = function() {
          // Keeping track of last invocation
          _last.invocation = +new Date();
          // Putting scrolling handler on event queue to
          // not interfere with angular's digests!
          $timeout($scope.handler);
        };

        // Bind to scrolling on elem
        // no debounce/throttle just now.
        elem.bind('scroll', _debounce(
          _determineScrolling, _thresholds.time
        ));

        // Remove scroll handler on $scope destruction:
        // one does not simply leave event handlers behind.
        $scope.$on('$destroy', function() {
          elem.unbind('scroll', _determineScrolling);
        });

        // To maintain integrity loading will occur without scrolling
        // avoiding a first hiccup when list is shorter than expected.
        _determineScrolling();
      }
    };
  }]);
}(angular, undefined));
