import NewPlace from 'places/pages/NewPlace';
import UserPlaces from 'places/pages/UserPlaces';
import React from 'react';
import {BrowserRouter as 
  Router,
  Route,
  Redirect,
  Switch
  } from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/Users';
const App = () => 
  <Router>
    <MainNavigation/> 
    <main>
      <Switch>
      <Route path = "/" exact>
        <Users/> 
      </Route>
      <Route path = "/:userId/places">
        <UserPlaces/>
      </Route>
      <Route path="/places/new">
        <NewPlace/>
      </Route>
      <Redirect to="/"/>
      </Switch>
    </main>
  </Router>
  ;

export default App;
