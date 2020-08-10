import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AddExprience from './components/profile-form/AddExperience';
import AddEduction from './components/profile-form/AddEducation'
import PrivateRoute from './components/routing/PrivateRoute'
import store from './store';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';

import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/create-profile" component={CreateProfile} />
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute exact path="/add-experience" component={AddExprience} />
            <PrivateRoute exact path="/add-education" component={AddEduction} />
          </Switch>
        </section>
      </Router>
    </Provider>
  )
}

export default App;