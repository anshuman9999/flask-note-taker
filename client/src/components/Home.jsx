import { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

function Home() {

  const { loggedIn } = useContext(AuthContext)

  return (
    <>

      {
        loggedIn ? <h1>Home</h1> : <Redirect to="/login" />
      }

    </>
  )
}


export default Home