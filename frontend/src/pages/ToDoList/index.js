import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Title from "../../components/Title";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  mainPaper: {
    marginTop:'80px',
    width:'1500px',
    height:'700px',
    borderRadius:'16px',
    marginLeft: '63px'

  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginTop: '20px',
    fontWeight: 'bold',
    color: '#0C2454',
  },
  paper: {
    width: '1190px',
    flexGrow: 1, // Altere esta linha
    borderRadius: '21px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    maxHeight: '80vh',
    overflow: 'hidden',
    overflowY: 'auto',
  },
  searchField: {
    backgroundColor: '#D9D9D9',
    borderRadius: '4px',
    height: '40px',
    width: '250px',
    border: '2px solid #A0A0A0',
    marginLeft: '20px',
    '& .MuiOutlinedInput-root': {
      '& input': {
        padding: '10px 14px',
      },
      '& fieldset': {
        border: 'none',
      },
    },
    '& .MuiInputAdornment-root': {
      marginTop: '-5px',
    },
  },
  blueLine: {
    height: '2px',
    backgroundColor: '#0C2454',
    margin: '1rem 0',
  },
  inputContainer: {
    display: 'flex',
    marginBottom: '1rem',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: '8px',
    border: '0',
    flexGrow: 1,
    marginRight: '0.5rem',
    padding: '10px',
    height: '50px',
    fontSize: '16px',
  },
  buttonRed: {
    backgroundColor: '#f44336',
    color: '#fff',
    borderRadius: '8px',
    padding: '6px 10px',
    minWidth: '60px',
    height: '52px',
    '&:hover': {
      backgroundColor: '#c62828',
    },
    marginLeft: '1.8rem',
    marginRight: '1.5rem',
  },
  button: {
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '14px',
    width: '100px',
    height: '51px',
  },
  listContainer: {
    marginTop: '1rem',
    backgroundColor: 'transparent',
    borderRadius: '6px',
  },
  listItem: {
    height: '60px',
    backgroundColor: '#E0E0E0',
    borderRadius: '8px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  infoContainer: {
    display: 'flex',
    marginLeft: '1.5rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  taskText: {
    flexGrow: 1,
    color: '#0C2454',
    fontWeight: 'bold',
    width:'20%'
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '20%',
    position: 'relative',
  },
  avatar: {
    marginRight: '8px',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '20%',
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '20%',
  },
  status: {
    color: '#4CAF50',
  },
  fundo: {
    marginTop:'80px',
    backgroundColor:'white',
    width:'90%',
    height:'80%',
    marginLeft:'67px',
    borderRadius:'18px',
    padding:'16px'
  },

});








const ToDoList = () => {
  const classes = useStyles();
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [searchParam, setSearchParam] = useState('');
  const [checked, setChecked] = useState([]);








  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);








  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);








  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };








  const handleAddTask = () => {
    if (!task.trim()) {
      return;
    }








    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = {
        text: task,
        createdAt: newTasks[editIndex].createdAt,
        updatedAt: now,
        status: newTasks[editIndex].status,
      };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task, createdAt: now, status: 'Pendente' }]);
      setTask('');
    }
  };








  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };








  const handleSearch = (event) => {
    setSearchParam(event.target.value);
  };








  const handleToggle = (index) => {
    const newTasks = [...tasks];
    newTasks[index].status = checked.includes(index) ? 'Pendente' : 'Concluída';
    setChecked((prev) => {
      const newChecked = [...prev];
      const currentIndex = newChecked.indexOf(index);
      if (currentIndex === -1) {
        newChecked.push(index);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      return newChecked;
    });
    setTasks(newTasks);
  };








  const formatTaskText = (text) => {
    if (text.length > 250) {
      return `${text.slice(0, 250)}\n${text.slice(250)}`;
    }
    return text;
  };








  return (
    <div className={classes.fundo}>
      <div className={classes.root}>
        <div className={classes.titleContainer}>
          <Title>
            Tarefas
          </Title>{/*colocar o tiltle*/}
          <TextField
            placeholder="Pesquisar..."
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              disableUnderline: true, // remove a linha
              style: {
                color: '#0C2454',// cor do texto normal
                fontWeight: 'bold', // texto em negrito
                backgroundColor: "#D9D9D9",
                borderRadius: '8px',
                height: "36.5px",
              },
              inputProps: {
                style: {
                  paddingLeft: '8px',
                  '&::placeholder': {
                    color: '#0C2454',
                    fontWeight: 'bold',
                    Opacity: 1, // cor do placeholder
                    paddingLeft: "10px"
                  
                  },
                },
              },
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#0C2454' }} />
                </InputAdornment>
              ),
            }}
        />
        </div>

        <div className={classes.blueLine} />

        <div className={classes.contentContainer}>
          <div className={classes.inputContainer}>
            <input
              placeholder="Nova tarefa"
              className={classes.input}
              value={task}
              onChange={handleTaskChange}
            />
            <Button
              onClick={handleDeleteTask}
              className={classes.buttonRed}
            >
              <DeleteIcon style={{ marginRight: '5px', marginLeft: '5px' }} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              className={classes.button}
            >
              {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
          <div className={classes.listContainer}>
            <List>
              {tasks.map((task, index) => (
                <ListItem key={index} className={classes.listItem}>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(index) !== -1}
                    tabIndex={-1}
                    disableRipple
                    onClick={() => handleToggle(index)}
                    style={{
                      color: "#0C2454",  // Cor do ícone quando marcado
                      backgroundColor: "#FFFFFF",  // Fundo branco
                      width: '20px',  // Ajuste da largura
                      height: '20px',  // Ajuste da altura
                      padding: '0px',  // Remove o padding extra
                      borderRadius: '4px',  // Bordas arredondadas
                      marginLeft: '10px',  // Move um pouco para a direita
                    }}
                  />

                  <div className={classes.infoContainer}>
                    <Typography className={classes.taskText}>
                      {task.text}
                    </Typography>


                    <Typography
                      variant="body2"
                      style={{
                    
                        marginRight: '10px',
                        fontWeight: 'bold',  // Negrito
                        color: '#0C2454',    // Azul
                      }}
                    >
                      Criado por:
                    </Typography>


                    <Avatar className={classes.avatar}>
                      U
                    </Avatar>

                    <Typography variant="body2" className={classes.date}>
                      <span style={{ fontWeight: 'bold', color: '#0C2454' }}>Criada em:</span>
                      <span style={{ color: '#0C2454' }}> {new Date(task.createdAt).toLocaleDateString()}</span>
                    </Typography>

                    <Typography variant="body2" className={classes.status}>
                      <span style={{ fontWeight: 'bold', color: '#0C2454' }}>Status:</span>
                      <span style={{ color: '#0C2454', marginLeft: '4px' }}>{task.status}</span>
                    </Typography>

                  </div>
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => setEditIndex(index)}>
                      <EditIcon style={{ color: "#0C2454" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTask(index)}>
                      <DeleteIcon style={{ color: "#0C2454" }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </div>
    </div>

  );
};








export default ToDoList;

