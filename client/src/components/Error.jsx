import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { Redirect } from 'react-router-dom'

const Error = (props) => {

    const state = props.message ? props.message : {message: ""}
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if(state.message) {
            setErrorMessage(state.message)
        }
    }, [])

    return (
        <Container>

            {
                !state.message
                ? <Redirect to="/dashboard" />
                : null
            }

            {
                errorMessage
                ? <Typography variant="h1" >{ errorMessage }</Typography>
                : null
            }

        </Container>
    )
}

export default Error
