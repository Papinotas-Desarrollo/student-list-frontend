import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { 
    Typography,
    Paper,
    TextField,
    Button
} from '@material-ui/core'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { ALL_STUDENTS } from './StudentList'
import {validate, format } from 'rut.js'

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 1,
        marginRight: theme.spacing.unit * 1,
    },
    typography: {
        textAlign: 'center',
        marginTop: theme.spacing.unit * 3,
    },
    caption: {
        textAlign: 'center',
        color: 'red'
    },
    paper: {
        marginTop: theme.spacing.unit * 5,
        marginLeft: 'auto', 
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        width: '400px'
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
      },
});

const CREATE_STUDENT = gql`
    mutation CreateStudent($rut: String!, $name: String!, $lastname: String!) {
        createStudent(rut: $rut, name: $name, lastname: $lastname) {
            id
            listNumber
            rut
            name
            lastname
            isPresent
        }
    }
`


class StudentAdd extends React.Component{
    state = {
        rut: '',
        name: '',
        lastname: '',
    }

    render(){
        const { classes } = this.props;
        const { rut, name, lastname } = this.state;

        return ( 
            <main className={classes.main}>
                <Mutation 
                    mutation={CREATE_STUDENT} 
                    variables={{ rut, name, lastname }}
                    onCompleted={() => this.props.history.push('/')}
                    update={ 
                        (store, { data: { createStudent } }) => {
                            try {
                                console.log(createStudent);
                                const data = store.readQuery({ query: ALL_STUDENTS });
                                data.allStudents.push(createStudent);
                                store.writeQuery({ query: ALL_STUDENTS, data });
                            }
                            catch(error) {
                                console.error(error);
                            }
                    }}>
                    {
                        (createStudent, {loading, error}) => (
                            <Paper className={classes.paper}>
                                <form className={classes.form} onSubmit={event => event.preventDefault()}>
                                    <Typography className={classes.typography} variant="h4" gutterBottom>Agregar estudiante</Typography>
                                    {error ? <Typography className={classes.caption} variant="caption" gutterBottom>Rut ya registrado</Typography> : null}
                                    <TextField
                                        label="Rut"
                                        value={rut}
                                        onChange={e => this.setState({ rut: format(e.target.value) })}
                                        type="text"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        fullWidth
                                        autoFocus/>
                                    {(!validate(rut) && rut.length>0) ? <Typography className={classes.caption} variant="caption" gutterBottom>Rut inválido</Typography> : null}
                                    <TextField
                                        label="Nombres"
                                        value={name}
                                        onChange={e => this.setState({ name: e.target.value })}
                                        type="text"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        fullWidth/>
                                    <TextField
                                        label="Apellidos"
                                        value={lastname}
                                        onChange={e => this.setState({ lastname: e.target.value })}
                                        type="text"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        fullWidth/>
                                    <Button
                                        type="submit"
                                        onClick={createStudent}
                                        fullWidth
                                        variant="contained"
                                        disabled={!validate(rut) || name.length<1 || lastname.length<1}
                                        color="primary"
                                        className={classes.submit}>
                                        Agregar
                                    </Button>
                                </form>
                            </Paper>
                        )
                    }
                </Mutation>
            </main>
        )
    }
}

export default withStyles(styles)(StudentAdd)