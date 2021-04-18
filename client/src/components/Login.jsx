import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../contexts/AuthContext'
import { Redirect, useHistory } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    field: {
        marginTop: 20,
        marginBottom: 20,
        display: "block"
    },
    formCard: {
        marginTop: "100px"
    }
})

const Login = () => {

    const classes = useStyles()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const { loggedIn, getLoggedInState } = useContext(AuthContext)

    const history = useHistory()

    const submitHandler = () => {

        const loginData = {
            email,
            password
        }

        async function login() {
            try {
                const response = await axios.get('/api/getcsrf', { withCredentials: true })
                //console.log(response.headers["x-csrftoken"]) 
                const token = response.headers["x-csrftoken"]

                await axios.post(
                    "/user/login",
                    loginData,
                    {
                        headers: {
                            'X-CSRFToken': token,
                        }
                    }
                )
                getLoggedInState()

                history.push("/dashboard")

            } catch (err) {
                setErrorMessage(err.response.data.message)
                //console.log(err.response)
            }

        }

        login()
    }

    return (
        <div className={classes.formCard} >

            {
                loggedIn
                    ? <Redirect to="/dashboard" />
                    : null
            }

            {
                errorMessage
                    ? <div
                        style={{
                            border: "1px solid red",
                            width: "60%",
                            height: "fit-content",
                            textAlign: "center",
                            margin: "auto",
                            marginBottom: "20px",
                            display: 'flex',
                            alignItem: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            borderRadius: "10px"
                        }}

                    > <p style={{ display: "inline-block" }} >{errorMessage}</p> </div>
                    : null
            }

            <Container>
                <Typography
                    variant="h4"
                    color="textSecondary"
                    gutterBottom
                >
                    Login
                </Typography>

                <form autoComplete="off" onSubmit={(e) => {
                    e.preventDefault()
                    submitHandler()
                }} >

                    <TextField
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email"
                        className={classes.field}
                        label="Email"
                        color="secondary"
                        variant="outlined"
                        fullWidth
                        required
                    />

                    <TextField
                        onChange={(e) => { setPassword(e.target.value) }}
                        type="password"
                        className={classes.field}
                        label="Password"
                        color="secondary"
                        variant="outlined"
                        fullWidth
                        required
                    />

                    <Button
                        type="submit"
                        className={classes.btn}
                        variant="contained"
                        color="secondary"
                        disabled={
                            !email ||
                            !password
                        }
                    >
                        Submit
                    </Button>

                </form>

            </Container>
        </div>
    )
}

export default Login
