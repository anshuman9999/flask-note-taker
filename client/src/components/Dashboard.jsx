import React, { useContext, useEffect, useState } from "react"
import { Redirect, useHistory } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios'
import DeleteIcon from '@material-ui/icons/Delete';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const useStyles = makeStyles({
    field: {
        marginTop: 20,
        marginBottom: 20,
        display: "block"
    }
})

toast.configure()

function Dashboard() {

    const classes = useStyles()

    const { loggedIn } = useContext(AuthContext)
    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const history = useHistory()

    const handleSubmit = async () => {
        try {
            const tokenResponse = await axios.get('/api/getcsrf', { withCredentials: true })
            //console.log(tokenResponse.headers["x-csrftoken"])
            const token = tokenResponse.headers["x-csrftoken"]

            const response = await axios.post(
                '/api/notes',
                { title },
                {
                    headers: {
                        "X-CSRFToken": token
                    }
                }
            )

            const noteId = response.data.note._id["$oid"]
            const noteIdString = `id=${noteId}`

            history.push({
                pathname: "/note",
                search: noteIdString
            })
        } catch (err) {
            console.log(err.response)
            console.log(err.response.data.msg)

            if(err.response.data.msg === `Missing cookie "access_token_cookie"`) {
                // history.push({
                //     pathname: "/error",
                //     state: {
                //         message: "User has logged out"
                //     }
                // })
                setErrorMessage("User has logged out")
            }

        }

    }

    async function getAllNotes() {
        const response = await axios.get(
            "/api/notes"
        )

        setNotes(response.data.notes)
    }

    useEffect(() => {
        getAllNotes()
    }, [])


    const deleteHandler = (noteId) => {
        async function deleteNote() {
            try {
                const tokenResponse = await axios.get('/api/getcsrf', { withCredentials: true })
                //console.log(tokenResponse.headers["x-csrftoken"])
                const token = tokenResponse.headers["x-csrftoken"]

                const response = await axios.delete(
                    `/api/notes/${noteId}`,
                    {
                        headers: {
                            "X-CSRFToken": token
                        }
                    }
                )

                //console.log(response.data)
                if (response.data.status === "success") {
                    getAllNotes()

                    toast.error("Note Deleted!", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 3000
                    })

                }
            } catch (err) {
                console.log(err.response)
            }
        }

        deleteNote()
    }

    return (
        <>

            {
                errorMessage
                ? <Redirect to="/error" message={errorMessage} />
                : null
            }

            {
                !loggedIn
                    ? <Redirect to="/login" />
                    : null
            }
            <Container>

                <Typography
                    variant="h6"
                    component="h2"
                    color="textSecondary"
                    gutterBottom
                >
                    Create A New Note
                </Typography>

                <form noValidate autoComplete="off" onSubmit={
                    (e) => {
                        e.preventDefault()
                        handleSubmit()
                    }
                } >

                    <TextField
                        onChange={(e) => { setTitle(e.target.value) }}
                        className={classes.field}
                        label="Note Title"
                        color="secondary"
                        variant="outlined"
                        fullWidth
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                    >
                        Submit
                    </Button>

                </form>

                <Typography
                    variant="h6"
                    component="h2"
                    color="textSecondary"
                    gutterBottom
                    style={{ marginTop: "20px" }}
                >
                    Saved Notes
                </Typography>

                <div>
                    {
                        notes
                            ? notes.map(
                                (note, index) => {
                                    return (
                                        <div
                                            style={{
                                                padding: "20px",
                                                borderBottom: "1px solid #333",
                                                display: "flex",
                                                justifyContent: "space-between"
                                            }}
                                            key={index}
                                        >
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                style={{ cursor: "pointer", display: "inline-block" }}
                                                onClick={
                                                    () => {
                                                        const noteId = note._id["$oid"]
                                                        const noteIdString = `id=${noteId}`

                                                        history.push({
                                                            pathname: "/note",
                                                            search: noteIdString
                                                        })
                                                    }
                                                }
                                            >
                                                {note.title}
                                            </Typography>

                                            <DeleteIcon
                                                style={{ fontSize: 30, cursor: "pointer" }}
                                                variant="contained"
                                                color="secondary"
                                                onClick={
                                                    (noteId) => {
                                                        deleteHandler(note._id["$oid"])
                                                    }
                                                }
                                            />


                                        </div>
                                    )
                                }
                            )
                            : null
                    }
                </div>

            </Container>

        </>
    )
}

export default Dashboard