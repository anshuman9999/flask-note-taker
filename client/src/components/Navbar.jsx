import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

const Navbar = () => {

    const { loggedIn } = useContext(AuthContext)

    return (
        <Container >
            <AppBar>
                <Toolbar>

                    <Typography variant="h5" style={{ flexGrow: 1 }} >
                        <Button
                            color="inherit"
                            component={Link}
                            to="/dashboard"
                            style={{ transform: "scale(1.5)" }}
                        >
                            Auth App
                        </Button>
                    </Typography>

                    {
                        !loggedIn
                            ? <Button
                                color="inherit"
                                component={Link}
                                to="/signup"
                            >
                                Sign Up
                            </Button>
                            : null
                    }


                    {
                        !loggedIn
                            ? <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                            >
                                Log In
                            </Button>
                            : null
                    }


                    {
                        loggedIn
                            ? <Button
                                color="inherit"
                                component={Link}
                                to="/dashboard"
                            >
                                Dashboard
                            </Button>
                            : null
                    }


                    {
                        loggedIn
                            ? <Button
                                color="inherit"
                                component={Link}
                                to="/logout"
                            >
                                Log Out
                            </Button>
                            : null
                    }

                </Toolbar>
            </AppBar>
        </Container>
        // <div>

        //     {
        //         !loggedIn
        //             ? <Link to="/signup"> Signup </Link>
        //             : null
        //     }


        //     {
        //         !loggedIn
        //             ? <Link to="/login"> Login </Link>
        //             : null
        //     }

        //     {
        //         loggedIn
        //             ? <Link to="/logout"> Logout </Link>
        //             : null
        //     }

        //     {
        //         loggedIn
        //             ? <Link to="/dashboard">Dashboard</Link>
        //             : null
        //     }
        // </div>
    )
}

export default Navbar
