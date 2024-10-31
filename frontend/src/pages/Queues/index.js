import React, { useEffect, useReducer, useState, useContext } from "react";
import { AccountCircle, DeleteOutline, Edit } from '@material-ui/icons';
import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import QueueModal from "../../components/QueueModal";
import QueueChatModal from "../../components/QueueChatModal"; // Importando o modal
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import { SocketContext } from "../../context/Socket/SocketContext";
import Title from "../../components/Title";
const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    borderRadius:'16px',

  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  blueLine: {
    border: 0,
    height: "2px",
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(2, 0),
  },
  filaschatbot: {
    padding:'16px'
  }
}));

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_QUEUES":
      const queues = action.payload;
      const newQueues = [];

      queues.forEach((queue) => {
        const queueIndex = state.findIndex((q) => q.id === queue.id);
        if (queueIndex !== -1) {
          state[queueIndex] = queue;
        } else {
          newQueues.push(queue);
        }
      });

      return [...state, ...newQueues];

    case "UPDATE_QUEUES":
      const queue = action.payload;
      const queueIndex = state.findIndex((u) => u.id === queue.id);

      if (queueIndex !== -1) {
        state[queueIndex] = queue;
        return [...state];
      } else {
        return [queue, ...state];
      }

    case "DELETE_QUEUE":
      const queueId = action.payload;
      const queueIndexDelete = state.findIndex((q) => q.id === queueId);
      if (queueIndexDelete !== -1) {
        state.splice(queueIndexDelete, 1);
      }
      return [...state];

    case "RESET":
      return [];

    default:
      return state;
  }
};

const Queues = () => {
  const classes = useStyles();
  const history = useHistory();

  const [queues, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false); // Estado para controlar o modal do chat

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/queue");
        dispatch({ type: "LOAD_QUEUES", payload: data });
        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-queue`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUEUES", payload: data.queue });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUEUE", payload: data.queueId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenQueueModal = () => {
    setQueueModalOpen(true);
    setSelectedQueue(null);
  };

  const handleCloseQueueModal = () => {
    setQueueModalOpen(false);
    setSelectedQueue(null);
  };

  const handleEditQueue = (queue) => {
    setSelectedQueue(queue);
    setQueueModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async (queueId) => {
    try {
      await api.delete(`/queue/${queueId}`);
      toast.success(i18n.t("Queue deleted successfully!"));
    } catch (err) {
      toastError(err);
    }
    setSelectedQueue(null);
  };

  const handleClickQueue = (queue) => {
    setSelectedQueue(queue); // Define a fila selecionada
    setChatModalOpen(true); // Abre o modal do chat
  };

  const handleCloseChatModal = () => {
    setChatModalOpen(false);
    setSelectedQueue(null); // Limpa a fila selecionada ao fechar o modal
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${
            selectedQueue.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("queues.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QueueModal
        open={queueModalOpen}
        onClose={handleCloseQueueModal}
        queueId={selectedQueue?.id}
      />
      <QueueChatModal // Renderizando o modal do chat
        open={chatModalOpen}
        onClose={handleCloseChatModal}
        greetingMessage={selectedQueue?.greetingMessage} // Passando o greetingMessage
      />
      <Paper className={classes.mainPaper} variant="outlined">
      <div className={classes.filaschatbot}>

      <MainHeader>
        <Title style={{ fontWeight: 'bold', color: '#0C2454' }}>
          Filas & Chatbot
        </Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenQueueModal}
          >
            {i18n.t("queues.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <hr className={classes.blueLine} />
        <Table size="small" style={{ width: '650px' }}>
          <TableBody>
            <>
              {queues.map((queue) => (
                <TableRow key={queue.id} style={{ marginBottom: '5px', borderRadius: '6px' }}>
                  <TableCell align="center" style={{ borderRadius: '6px' }}>
                    <div>
                      <div
                        onClick={() => handleClickQueue(queue)} // Modificado para passar a fila
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', borderRadius: '6px', backgroundColor: '#D9D9D9', width: '650px', height: '75px', cursor: 'pointer' }}
                      >
                        <AccountCircle style={{ position: 'absolute', top: '14px', left: '20px', width: '45px', height: '45px', color: '#0C2454' }} />
                        <Typography
                          style={{
                            position: 'absolute',
                            top: '10.50px',
                            left: '91px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: '#0C2454',
                            fontWeight: 'bold',
                          }}
                          variant="body2"
                        >
                          {queue.name}
                        </Typography>
                        <span style={{ position: 'absolute', top: '10.50px', left: '590px', color: '#0C2454', fontWeight: 'bold', marginRight: '5px' }}>
                          Cor
                        </span>
                        <span
                          style={{
                            position: 'absolute',
                            top: '10.50px',
                            left: '544px',
                            backgroundColor: queue.color,
                            width: 15,
                            height: 15,
                            borderRadius: '100px',
                          }}
                        />
                        <hr style={{ position: 'absolute', top: '32px', left: '87px', backgroundColor: '#0C2454', width: '375px', height: '2px', border: 'none', margin: '0' }} />
                        <Typography
                          style={{
                            position: 'absolute',
                            top: '42px',
                            left: '91px',
                            whiteSpace: 'nowrap',
                            color: '#0C2454',
                            fontWeight: 'bold',
                          }}
                          variant="body2"
                        >
                          Ordenação: {queue.orderQueue}
                        </Typography>
                        <div style={{ position: 'absolute', top: '42px', left: '544px', display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation(); // Previne a abertura do chatbot
                              handleEditQueue(queue);
                            }}
                            style={{ marginRight: '5px' }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation(); // Previne a abertura do chatbot
                              setSelectedQueue(queue);
                              setConfirmModalOpen(true);
                            }}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={4} />}
            </>
          </TableBody>
        </Table>
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Queues;
