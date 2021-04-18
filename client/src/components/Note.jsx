import React, { useContext, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Redirect, useHistory } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext';

const useStyles = makeStyles({
    field: {
        marginTop: 20,
        marginBottom: 20,
        display: "block"
    }
})

toast.configure()

export default function Note(props) {
    const queryParams = new URLSearchParams(props.location.search)
    let idCopy;
    for (let param of queryParams.entries()) {
        if (param[0] === 'id') {
            idCopy = param[1]
        }
    }

    const classes = useStyles()

    const [noteId] = useState(idCopy)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const history = useHistory()

    const { loggedIn } = useContext(AuthContext)

    useEffect(() => {
        async function getNote() {
            const response = await axios.get(
                `/api/notes/${noteId}`
            )

            //console.log(response.data)
            setTitle(response.data.note.title)
            setContent(response.data.note.content)
        }

        getNote()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        async function updateNote() {

            const tokenResponse = await axios.get('/api/getcsrf', { withCredentials: true })
            //console.log(tokenResponse.headers["x-csrftoken"])
            const token = tokenResponse.headers["x-csrftoken"]

            const response = await axios.patch(
                `/api/notes/${noteId}`,
                {
                    title,
                    content
                },
                {
                    headers: {
                        "X-CSRFToken": token
                    }
                }
            )

            if (response.data.status === "success") {
                history.push({
                    pathname: "/dashboard"
                })
                toast.info("saved", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 3000
                })
            }

        }
        updateNote()

    }

    return (
        <Container>

            {
                !loggedIn
                    ? <Redirect to="/login" />
                    : null
            }

            <Typography
                variant="h6"
                component="h2"
                color="textSecondary"
                gutterBottom
            >
                Create A New Note
            </Typography>

            <form noValidate autoComplete="off" onSubmit={(e) => handleSubmit(e)} >

                <label>Note Title</label>
                <TextField
                    onChange={(e) => { setTitle(e.target.value) }}
                    className={classes.field}
                    value={title}
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    required
                />
                <label>Content</label>
                <TextField
                    onChange={(e) => { setContent(e.target.value) }}
                    className={classes.field}
                    value={content}
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    required
                    multiline
                    rows={4}
                />

                <Button
                    type="submit"
                    className={classes.btn}
                    variant="contained"
                    color="secondary"
                >
                    Submit
                </Button>

            </form>
        </Container>
    )
}
