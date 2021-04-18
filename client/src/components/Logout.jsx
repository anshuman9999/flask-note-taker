import axios from 'axios'
import { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'

const Logout = () => {

    const { getLoggedInState, loggedIn } = useContext(AuthContext)

    useEffect(() => {
        if (loggedIn) {
            async function logout() {
                const response = await axios.get('/user/logout')
                console.log(response.data)
                getLoggedInState()
            }

            logout()
        }
    }, [])

    return (
        <>
            {
                !loggedIn
                    ? <Redirect to="/login" />
                    : null
            }
            <h1>Logout</h1>
        </>
    )
}

export default Logout