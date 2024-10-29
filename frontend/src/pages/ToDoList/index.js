import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
import Paper from "@material-ui/core/Paper";
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '2rem',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginTop: '30px',
    fontWeight: 'bold',
    color: '#0C2454',
  },
  searchField: {
    backgroundColor: '#CCCCCC',
    borderRadius: '4px',
    height: '40px',
    width: '250px',
    border: '2px solid #A0A0A0',
    marginTop: '15px',
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
    backgroundColor: '#CCCCCC',
    borderRadius: '4px',
    border: '2px solid #A0A0A0',
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
    backgroundColor: '#E0E0E0', // Fundo cinza claro
    borderRadius: '8px',
    marginBottom: '8px',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
  },
  listItemText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: '190px', // Reduzido para aproximar o avatar
  },
  status: {
    color: '#4CAF50', // Verde para o status "Concluída"
    marginLeft: '270px', // Adiciona espaçamento à esquerda
  },
  date: {
    color: '#757575', // Cinza para a data
    marginLeft: '12px', // Adiciona espaçamento à esquerda
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto', // Para que o espaço fique reduzido
  },
  taskText: {
    marginLeft: '16px', // Espaço entre o texto da tarefa e o contêiner de informações
    flexGrow: 1, // Permite que o texto ocupe o espaço disponível
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

  return (
    <Paper
        className={classes.mainPaper}
        variant="outlined"
      >
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography variant="h6" className={classes.title}>
          Tarefas
        </Typography>
        <TextField
          placeholder="Pesquisar..."
          value={searchParam}
          onChange={handleSearch}
          variant="outlined"
          className={classes.searchField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon style={{ color: "#0C2454" }} />
                </IconButton>
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
                <Typography variant="body2" className={classes.taskText} style={{ color: '#0C2454', fontWeight: 'bold' }}>
  {task.text}
</Typography>


                  <Typography
  variant="body2"
  style={{
    marginLeft: "100px",
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
    </Paper>
  );
};

export default ToDoList;
