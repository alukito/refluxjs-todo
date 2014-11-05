(function(Reflux, Actions, window) {
    'use strict';
    
    var todoCounter = 0;
    var storageKey = "todolist";
    
    function loadList() {
        if (window.localStorage) {
          var list = window.localStorage[storageKey];
          if (list)
            return JSON.parse(list);
        }
        return [];
    }
    
    function persistList(list) {
        if(window.localStorage) {
          window.localStorage[storageKey]=JSON.stringify(list);
        }
    }
    
    window.TodoStore = Reflux.createStore({
      init: function() {
        this.list = loadList();
        todoCounter = this.list.length;
        this.listenTo(Todo.add, this.addItem);
        this.listenTo(Todo.toggle, this.toggleItem),
        this.listenTo(Todo.destroy, this.destroyItem);
      },
      
      addItem: function(itemText) {
        this.list.push({
           id: todoCounter++,
           title: itemText,
           isCompleted: false
        });
        
        this.trigger(this.list);
      },
      
      toggleItem: function(item, checked) {
        item.isCompleted = checked;
        this.trigger(this.list);
      },
      
      destroyItem: function(item) {
        _.pull(this.list, item);
        this.trigger(this.list);
      },
      
      getDefaultData: function() {
        return this.list;
      }
      
    });
    
    window.TodoStore.listen(function(list) {
      persistList(list);
    });
    
})(window.Reflux, window.Actions, window);
