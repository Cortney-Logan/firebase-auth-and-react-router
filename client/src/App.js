import { useState, useEffect } from "react";
import {
  Switch,
  BrowserRouter,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database"; //use firebase/firestore if you want to use firestore

const fireBaseConfigObj = {
  apiKey: "AIzaSyAlnsvrl7Pko8Hm7oqYT4aVeUvcp3lplcU",
  authDomain: "first-example-project-73c9e.firebaseapp.com",
  databaseURL:
    "https://first-example-project-73c9e-default-rtdb.firebaseio.com",
  projectId: "first-example-project-73c9e",
  storageBucket: "first-example-project-73c9e.appspot.com",
  messagingSenderId: "1007056047942",
  appId: "1:1007056047942:web:7fe015dd56e26750e4df47",
  measurementId: "G-8PGDEYL0F2",
}; //replace undefined with own firebase config

//firebase.apps gives us an array of all initialized firebase apps.  We only want 1
if (firebase.apps.length === 0) {
  firebase.initializeApp(fireBaseConfigObj);
}

function App() {
  //track signed in user
  const [user, setUser] = useState(null);
  //track form submission
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //redirect by pushing to history obj
  let history = useHistory();

  //handle email input
  function emailChangeHandler(evt) {
    setEmail(evt.target.value);
  }

  //handle password input
  function passwordChangeHandler(evt) {
    setPassword(evt.target.value);
  }

  //handle form submission
  async function login(evt) {
    //prevent the form from sending information anywhere
    evt.preventDefault();

    //authenticate with firebase and store user object in a variable
    const userObj = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        //if the auth fails, print error message in console (prevents site from crashing on failed login)
        console.log(err.message);
      });

    //after login, store user object in state; note that if no user was signed in, then userObj is null
    setUser(userObj);

    //redirect to dashboard route
    history.push("/dashboard");
  }

  return (
    <Switch>
      <Route
        exact
        path="/"
        // anonymous function that returns the Home component - allows you to pass props
        render={(props) => {
          return (
            <Home
              user={user}
              login={login}
              email={email}
              password={password}
              emailChangeHandler={emailChangeHandler}
              passwordChangeHandler={passwordChangeHandler}
            />
          );
        }}
      />
      <Route
        path="/dashboard"
        render={(props) => {
          return <Dashboard user={user} />;
        }}
      />
    </Switch>
  );
}

function Home(props) {
  return (
    <div>
      <h2>Please sign in or:</h2>
      {/* if user is already signed in clicking the link will bring them to their dashboard */}
      <Link to="/dashboard">Go to your dashboard</Link>
      <form onSubmit={props.login}>
        <input
          type="email"
          onChange={props.emailChangeHandler}
          value={props.email}
        />
        <input
          type="password"
          onChange={props.passwordChangeHandler}
          value={props.password}
        />
        <input type="submit" />
      </form>
    </div>
  );
}

function Dashboard(props) {
  //if there is a user show the dashboard, otherwise send them back to the home page (and clear state)
  return props.user ? <h1>Welcome Back!</h1> : <Redirect to="/" />;
}

export default App;
