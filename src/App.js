import NewPlace from 'places/pages/NewPlace';
import UpdatePlace from 'places/pages/UpdatePlace';
import UserPlaces from 'places/pages/UserPlaces';
import React, { useCallback, useState } from 'react';
import {
  BrowserRouter as
    Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { AuthContext } from 'shared/context/auth-context';
import Auth from 'user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/Users';

const App = () => {
  //State
  const [isLoggedIn, setLoggedIn] = useState(false);
  //Context
  const login = useCallback(() => setLoggedIn(true), []);
  const logout = useCallback(() => setLoggedIn(false), []);
  //Body
  let routes = isLoggedIn ? (
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/:userId/places">
        <UserPlaces />
      </Route>
      <Route path="/places/new" exact>
        <NewPlace />
      </Route>
      <Route path="/places/:placeId">
        <UpdatePlace />
      </Route>
      <Redirect to="/" />
    </Switch>
  ) : (
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/:userId/places">
        <UserPlaces />
      </Route>
      <Route path="/auth">
        <Auth />
      </Route>
      <Redirect to="/auth" />
    </Switch>
  )
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout
      }}>
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>)
}


export default App;
