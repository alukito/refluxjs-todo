(function(Reflux, window) {
    'use strict';

   window.Todo = Reflux.createActions([
      'add',
      'toggle',
      'destroy'
   ]);

})(window.Reflux, window);
