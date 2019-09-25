import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { 
    Fab,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit,
    },
    typography: {
        textAlign: 'center',
        marginTop: theme.spacing.unit * 3,
    },
    paper: {
        marginLeft: 'auto', 
        marginRight: 'auto',
        width: '80%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
});

export const ALL_STUDENTS = gql`
    {   
        allStudents {
            id
            listNumber
            rut
            name
            lastname
            isPresent
        }
    }
`
const UPDATE_STUDENT_ISPRESENT = gql`
    mutation UpdateStudent($id: ID!, $isPresent: Boolean!) {
        updateStudent(id: $id, isPresent: $isPresent) {
            id
            listNumber
            rut
            name
            lastname
            isPresent
        }
    }
`

const DESTROY_STUDENT = gql`
    mutation DestroyStudent($id: ID!) {
        destroyStudent(id: $id) {
            id
            listNumber
            rut
            name
            lastname
            isPresent
        }
    }
`

class StudentList extends React.Component{
    render(){
        const { classes } = this.props;

        return (
            <Query query={ALL_STUDENTS}>
                {({ loading, error, data }) => {
                    if (loading) return <Typography className={classes.typography} variant="h4" gutterBottom>Cargando</Typography>
                    if (error) return <Typography className={classes.typography} variant="h4" gutterBottom>Error</Typography>
                
                    const studentsToRender = data.allStudents
                
                    return (
                        <div>
                            <Typography className={classes.typography} variant="h4" gutterBottom>Lista de Estudiantes</Typography>
                            <Paper className={classes.paper}>
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Número de lista</TableCell>
                                            <TableCell align="left">Rut</TableCell>
                                            <TableCell align="left">Nombres</TableCell>
                                            <TableCell align="left">Apellidos</TableCell>
                                            <TableCell align="left">Presente</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Agregar estudiante">
                                                    <Fab 
                                                        size="small"
                                                        color="primary" 
                                                        aria-label="Add" 
                                                        className={classes.fab} 
                                                        onClick={()=>this.props.history.push('/add')}>
                                                        <AddIcon />
                                                    </Fab>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {
                                        studentsToRender.map(
                                            student =>  (
                                                <TableRow key={student.id}>
                                                    <TableCell component="th" scope="row">{student.listNumber}</TableCell>
                                                    <TableCell align="left">{student.rut}</TableCell>
                                                    <TableCell align="left">{student.name}</TableCell>
                                                    <TableCell align="left">{student.lastname}</TableCell>
                                                    <TableCell align="left">
                                                    <Mutation 
                                                        mutation={UPDATE_STUDENT_ISPRESENT} 
                                                        variables={ {id: student.id, isPresent: !student.isPresent} }
                                                        >
                                                        {
                                                            updateStudent => (
                                                                <Checkbox
                                                                    checked={student.isPresent}
                                                                    onChange={updateStudent}
                                                                    value="isPresent"
                                                                    color="primary"/>
                                                            )
                                                        }
                                                    </Mutation>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Editar estudiante">
                                                            <Fab 
                                                                size="small"
                                                                color="secondary" 
                                                                aria-label="Edit" 
                                                                className={classes.fab} 
                                                                onClick={()=>this.props.history.push('/edit',{id: student.id, rut: student.rut, listNumber: student.listNumber})}>
                                                                <EditIcon />
                                                            </Fab>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar estudiante">
                                                            <Mutation 
                                                                mutation={DESTROY_STUDENT} 
                                                                variables={ {id: student.id} }
                                                                update={(proxy, { data: { destroyStudent } }) => {
                                                                    console.log(destroyStudent);

                                                                    let data = proxy.readQuery({ query: ALL_STUDENTS  })

                                                                    const studentIndex = data.allStudents.findIndex(student => {
                                                                        return student.id === destroyStudent.id;
                                                                    });

                                                                    data.allStudents.splice(studentIndex,1);

                                                                    proxy.writeQuery({ query: ALL_STUDENTS, data })
                                                                }}>
                                                                {
                                                                    destroyStudent => (
                                                                        <Fab 
                                                                            size="small"
                                                                            aria-label="Delete" 
                                                                            className={classes.fab} 
                                                                            onClick={destroyStudent}>
                                                                            <DeleteIcon />
                                                                        </Fab>
                                                                    )
                                                                }
                                                            </Mutation>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )
                                    }
                                    </TableBody>
                                </Table>
                            </Paper>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default withStyles(styles)(StudentList)