import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import StudentList from './pages/StudentList'
import StudentAdd from './pages/StudentAdd'
import StudentEdit from './pages/StudentEdit'


function App() {
  return (
    <Switch>
      <Route path="/" exact component={StudentList} />
      <Route path="/add" component={StudentAdd} />
      <Route path="/edit" component={StudentEdit} />
    </Switch>
  );
}

export default App;
