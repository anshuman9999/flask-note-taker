import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

const AuthContext = createContext()

const AuthContextProvider = (props) => {

    const [loggedIn, setLoggedIn] = useState(undefined)
    const [currentUser, setCurrentUser] = useState(undefined)
    //let csrfToken
    // const [token, setToken] = useState("")
    async function getLoggedInState() {

        try {
            const response = await axios.get('/user/get_loggedin_user', { withCredentials: true })
            if (response.data.status === "success") {
                setLoggedIn(true)
                setCurrentUser(response.data.user)
            } else {
                setLoggedIn(false)
            }
        } catch (err) {
            setLoggedIn(false)
            console.log(err.response)
        }


    }

    useEffect(() => {
        getLoggedInState()
    }, [])


    // useEffect(() => {
    //     const csrf = () => {
    //         fetch("/api/getcsrf", {
    //             credentials: "same-origin",
    //         })
    //             .then((res) => {
    //                 // csrfToken = res.headers.get(["X-CSRFToken"]);
    //                 // console.log(csrfToken);
    //                 console.log(res.headers.get(["X-CSRFToken"]))
    //                 setToken(res.headers.get(["X-CSRFToken"]))
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     }

    //     csrf()
    // })

    const contextValue = {
        loggedIn,
        currentUser,
        getLoggedInState,
        // token
    }

    return (
        <AuthContext.Provider value={contextValue} >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext

export {
    AuthContextProvider
}