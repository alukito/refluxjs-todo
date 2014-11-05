/** @jsx React.DOM */

function isEnterKeyPressed(evt) {
  return evt.nativeEvent.keyCode === 13;
}

function isNotEmpty(text) {
  return text && text !== "";
}

function setEmpty(textfield) {
  textfield.value = '';
}

var Header = React.createClass({
  addTodo: function(evt) {
    var text = evt.target.value;
    if (isEnterKeyPressed(evt) && isNotEmpty(text)) {
      Todo.add(text);
      setEmpty(evt.target);
    }
  },
  
  render: function() {
    return (
      <header id="header">
        <h1>Todos</h1>
        <input id="new-todo" placeholder="What needs to be done?" autofocus onKeyUp={this.addTodo}/>
      </header>
    )
  }
});

var TodoItem = React.createClass({
  handleToggle: function(evt) {
    var checked = evt.target.checked;
    Todo.toggle(this.props.item, checked);
  },
  
  handleDestroy: function(evt) {
    Todo.destroy(this.props.item);
  },
  
  render: function() {
    var classes = React.addons.classSet({
      'completed' : this.props.item.isCompleted
    });
    
    return (
      <li className={classes}>
        <div className="view">
          <input className="toggle" type="checkbox" onChange={this.handleToggle}/>
          <label>{this.props.item.title}</label>
          <button className="destroy" onClick={this.handleDestroy}/>
        </div>
      </li>
    )
  }
});

var TodoList = React.createClass({
  render: function() {
    var todo = function(item) {
       return (
          <TodoItem key={item.id} item={item} />
       )
    }
    
    return (
      <ul id="todo-list">
        {this.props.items.map(todo)}
      </ul>
    )
  }
});


var TodoMain = React.createClass({  
  render: function() {
  
    var state = this.props.state;
    
    var filteredList = _.filter(this.props.list, function(item) {
      if (state === 'completed') {
        return item.isCompleted;
      } else if (state === 'active') {
        return !item.isCompleted;
      } else {
        return true;
      }
      
    });
  
    return (
        <section id="main">
          <input id="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <TodoList items={filteredList} />
        </section>
    )
  }
});

var Footer = React.createClass({
  
  render: function() {
    var notCompletedCount = function(list) {
      return _.filter(list, function(item) {
        return !item.isCompleted;
      }).length;
    };
    
    return (
        <footer id="footer">
          <span id="todo-count">
            <strong>{notCompletedCount(this.props.list)}</strong>
            <span> items left </span>
          </span>
          <ul id="filters">
          <li>
          <ReactRouter.Link activeClassName="selected" to="/">All</ReactRouter.Link>
          </li>
          <li>
          <ReactRouter.Link activeClassName="selected" to="/active">Active</ReactRouter.Link>
          </li>
          <li>
          <ReactRouter.Link activeClassName="selected" to="/completed">Completed</ReactRouter.Link>
          </li>
          </ul>
        </footer>
    )
  }
});


var TodoApp = React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState: function() {
    return { list: [] }
  },
  componentDidMount: function() {
    this.listenTo(TodoStore, this.listChanged, this.listChanged);
  },
  listChanged: function(todoList) {
    this.setState({ list: todoList});
  },
  render: function() {
    return (
       <div>
         <Header />
         <this.props.activeRouteHandler list={this.state.list}/>
         <Footer list={this.state.list} />
       </div>
    )
  }
});

var routes = (
    <ReactRouter.Routes location="hash">
        <ReactRouter.Route handler={TodoApp}>
            <ReactRouter.Route path="/" handler={TodoMain} state="all" />
            <ReactRouter.Route path="/completed" handler={TodoMain} state="completed" />
            <ReactRouter.Route path="/active" handler={TodoMain} state="active" />
        </ReactRouter.Route>
    </ReactRouter.Routes>
);

React.renderComponent(routes, document.getElementById('todoapp'));
