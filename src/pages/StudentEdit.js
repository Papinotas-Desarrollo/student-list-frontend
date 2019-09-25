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

const UPDATE_STUDENT_RUT = gql`
    mutation UpdateStudent($id: ID!, $rut: String!, $listNumber: Int!) {

        updateStudent(id: $id, rut: $rut, listNumber: $listNumber) {
            id
            listNumber
            rut
            name
            lastname
            isPresent
        }
    }
`


class StudentEdit extends React.Component{
    state = {
        id: '',
        rut: '',
        listNumber: '',
        currentRut: ''
    }

    componentWillMount(){
        if(this.props.location.state){
            if(this.props.location.state.id){
                this.setState({id: this.props.location.state.id})
                this.setState({rut: this.props.location.state.rut})
                this.setState({listNumber: this.props.location.state.listNumber})
                this.setState({currentRut: this.props.location.state.rut})
            }
            else {
                this.props.history.push('/')
            }
        }
        else {
            this.props.history.push('/')
        }
    }

    render(){
        const { classes } = this.props;
        const { id, rut, listNumber} = this.state;

        return ( 
            <main className={classes.main}>
                <Mutation 
                    mutation={UPDATE_STUDENT_RUT} 
                    variables={{ id, rut, listNumber }}
                    onCompleted={() => this.props.history.push('/')}>
                    {
                        (updateStudent, {loading, error}) => (
                            <Paper className={classes.paper}>
                                <form className={classes.form} onSubmit={event => event.preventDefault()}>
                                    <Typography className={classes.typography} variant="h4" gutterBottom>{'Editar estudiante'}</Typography>
                                    {error ? 
                                        error.message.includes('Rut has already been taken') ? 
                                            <Typography className={classes.caption} variant="caption" gutterBottom>Rut ya registrado</Typography>
                                        : null
                                    :null}
                                    {error ? 
                                        error.message.includes('List number has already been taken') ? 
                                            <Typography className={classes.caption} variant="caption" gutterBottom>Número ya registrado</Typography>
                                        : null
                                    :null}
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
                                        label="Número de lista"
                                        value={listNumber}
                                        onChange={e => this.setState({ listNumber: e.target.value?parseInt( e.target.value) : "" })}
                                        type="number"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        fullWidth
                                        />
                                    {(listNumber<1 || listNumber>999999999999) ? <Typography className={classes.caption} variant="caption" gutterBottom>Número fuera de rango</Typography> : null}
                                    <Button
                                        type="submit"
                                        onClick={updateStudent}
                                        fullWidth
                                        variant="contained"
                                        disabled={!validate(rut) || listNumber<1 || listNumber>999999999999}
                                        color="primary"
                                        className={classes.submit}>
                                        Editar
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

export default withStyles(styles)(StudentEdit)