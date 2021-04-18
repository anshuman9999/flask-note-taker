import React, { useContext, useState } from 'react'
import axios from 'axios'
import AuthContext from '../contexts/AuthContext'
import { Redirect } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'

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

const Signup = () => {
    const classes = useStyles()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const { loggedIn } = useContext(AuthContext)

    const history = useHistory()

    const submitHandler = () => {

        const signupData = {
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            email,
            password
        }

        async function signup() {

            try {

                const tokenResponse = await axios.get('/api/getcsrf', { withCredentials: true })
                //console.log(response.headers["x-csrftoken"]) 
                const token = tokenResponse.headers["x-csrftoken"]

                const response = await axios.post(
                    "/user/signup",
                    signupData,
                    {
                        headers: {
                            'X-CSRFToken': token,
                        }
                    }
                )

                //console.log(response.data)

                if(response.data.status === "success") {
                    history.push({
                        pathname: "/login"
                    })
                }

            } catch (err) {
                setErrorMessage(err.response.data.message)
                console.log(err.response)
            }

        }


        signup()
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
                    SignUp
                </Typography>

                <form autoComplete="off" onSubmit={(e) => {
                    e.preventDefault()
                    submitHandler()
                }} >

                    <TextField
                        onChange={(e) => { setFirstName(e.target.value) }}
                        className={classes.field}
                        label="First Name"
                        color="secondary"
                        variant="outlined"
                        fullWidth
                        required
                    />

                    <TextField
                        onChange={(e) => { setLastName(e.target.value) }}
                        className={classes.field}
                        label="Last Name"
                        color="secondary"
                        variant="outlined"
                        fullWidth
                        required
                    />

                    <TextField
                        onChange={(e) => { setPhone(e.target.value) }}
                        type="number"
                        className={classes.field}
                        label="Phone"
                        color="secondary"
                        variant="outlined"
                        fullWidth
                        required
                    />

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

export default Signup
