import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';
import MainContainer from "../../components/MainContainer";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  button: {
    background: "#10a110",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  blueLine: {
    border: 0,
    height: "2px",
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(2, 0),
  },
  container: {
    padding: theme.spacing(3),
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const Kanban = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const jsonString = user.queues.map(queue => queue.UserQueue.queueId);

  const [tags, setTags] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [file, setFile] = useState({ lanes: [] });

  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");
      setTags(response.data.lista || []);
      await fetchTickets(jsonString);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTickets = async (jsonString) => {
    try {
      const { data } = await api.get("/ticket/kanban", {
        params: { queueIds: JSON.stringify(jsonString), teste: true },
      });
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };

  const popularCards = (jsonString) => {
    const filteredTickets = tickets.filter(ticket => ticket.tags.length === 0);
    const lanes = [
      {
        id: "lane0",
        title: i18n.t("Em aberto"),
        label: "0",
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
            <div>
              <p>{ticket.contact.number}<br />{ticket.lastMessage}</p>
              <button 
                className={classes.button} 
                onClick={() => handleCardClick(ticket.uuid)}
              >
                Ver Ticket
              </button>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
        style: { backgroundColor: "#0C2454", color: "white" }, // Define cor de fundo e texto branco
      },
      ...tags.map(tag => {
        const taggedTickets = tickets.filter(ticket => ticket.tags.some(t => t.id === tag.id));
        return {
          id: tag.id.toString(),
          title: tag.name,
          label: tag.id.toString(),
          cards: taggedTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: "Ticket nº " + ticket.id.toString(),
            description: (
              <div>
                <p>{ticket.contact.number}<br />{ticket.lastMessage}</p>
                <button 
                  className={classes.button} 
                  onClick={() => handleCardClick(ticket.uuid)}
                >
                  Ver Ticket
                </button>
              </div>
            ),
            title: ticket.contact.name,
            draggable: true,
            href: "/tickets/" + ticket.uuid,
          })),
          style: { backgroundColor: tag.color, color: "white" }
        };
      }),
    ];
    setFile({ lanes });
  };

  const handleCardClick = (uuid) => {
    history.push('/tickets/' + uuid);
  };

  useEffect(() => {
    fetchTags();
    popularCards(jsonString);
  }, [tags, tickets]);

  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    try {
      await api.delete(`/ticket-tags/${targetLaneId}`);
      toast.success('Ticket Tag Removido!');
      await api.put(`/ticket-tags/${targetLaneId}/${sourceLaneId}`);
      toast.success('Ticket Tag Adicionado com Sucesso!');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainContainer>
      <Paper className={classes.container}>
        <Typography variant="h6" style={{ fontWeight: 'bold', color: '#0C2454', paddingTop: '20px' }}>
          Kanban
        </Typography>
        <hr className={classes.blueLine} />
        <Board 
          data={file} 
          onCardMoveAcrossLanes={handleCardMove}
          style={{ backgroundColor: '#fff' }}
        />
      </Paper>
    </MainContainer>
  );
};

export default Kanban;
