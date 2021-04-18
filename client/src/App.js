import { Route } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Logout from './components/Logout'
import AuthContext, { AuthContextProvider } from './contexts/AuthContext'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import { useContext, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'
import Error from './components/Error'

function App() {
  const { loggedIn, token } = useContext(AuthContext)

  axios.defaults.headers.post['X-CSRFToken'] = token

  return (
    <>

      <Navbar />

      <Route path="/" component={Home}/>
      {
        loggedIn === true && 
        <Route path="/dashboard" component={Dashboard} />
      }
      <Route path="/signup" component={Signup} />

      {
        (loggedIn === true || loggedIn === false) &&
        <Route path="/login" component={Login} />
      }

      {
        (loggedIn === true || loggedIn === false) &&
        <Route path="/note" component={Note} />
      }

      <Route path="/error" render={
        (props) => <Error {...props} />
      } />

      <Route path="/logout" component={Logout} />

    </>
  );
}

export default App;
