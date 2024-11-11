import React, { useContext, useState } from "react";
import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Box,
  Typography,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";

import thrash from "../../assets/thrashcan.png";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ConfirmationModal from "../../components/ConfirmationModal";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  lixo: {
    transform: "scale(0.5)",
  },
  // titulo
  tt: {
    position: "relative",
    bottom: "50px",
    marginLeft: "20%",
    color: "#0C2454",
  },
  // linha abaixo do titulo
  ln: {
    height: "2px",
    width: "350%",
    backgroundColor: "#0C2454",
    position: "relative",
    left: "20%",
    bottom: "50px",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    flex: 1,
    height: "calc(100% - 58px)",
    width: "700px",
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF", // DARK MODE PLW DESIGN
  },
  chatList: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    flex: 1,
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    width: "660px",
    height: "auto",
    backgroundColor: "#FFFFFF",
    left: "50px",
    overflow:"hidden",
  },
  listItem: {
    cursor: "pointer",
    backgroundColor: "#D9D9D9",
    borderRadius: "6px",
    marginBottom: theme.spacing(2),
    height: "75px",
    width: "651.3px", // Garante que o item ocupe toda a largura disponível
    marginLeft: "0px", // Remove a margem esquerda
    position: "relative",
  },
  // linha preta entre o título e a prévia
  ln2: {
    height: "2px",
    width: "80%",
    backgroundColor: "#0C2454",
    position: "relative",
    marginTop: "5px",
    marginBottom: "5px",
    borderRadius:"5px",
  },
}));


export default function ChatList({
  chats,
  handleSelectChat,
  handleDeleteChat,
  handleEditChat,
  pageInfo,
  loading,
}) {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { datetimeToClient } = useDate();
  const [confirmationModal, setConfirmModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const { id } = useParams();

  const goToMessages = async (chat) => {
    if (unreadMessages(chat) > 0) {
      try {
        await api.post(`/chats/${chat.id}/read`, { userId: user.id });
      } catch (err) {}
    }

    if (id !== chat.uuid) {
      history.push(`/chats/${chat.uuid}`);
      handleSelectChat(chat); // Atualiza o chat selecionado no componente pai
    }
  };

  const handleDelete = () => {
    handleDeleteChat(selectedChat);
  };

  const unreadMessages = (chat) => {
    const currentUser = chat.users.find((u) => u.userId === user.id);
    return currentUser.unreads;
  };

  const getPrimaryText = (chat) => {
    const mainText = chat.title;
    const unreads = unreadMessages(chat);
    return (
      <>
        <span style={{ fontWeight: "bold", display: "block" }}>{mainText}</span>
        <div className={classes.ln2}></div>
        {unreads > 0 && (
          <Chip
            size="small"
            style={{ marginLeft: 5 }}
            label={unreads}
            color="secondary"
          />
        )}
      </>
    );
  };

  const getSecondaryText = (chat) => {
    return chat.lastMessage !== ""
      ? (
        <span style={{ marginTop: "8px", display: "block" }}>
          {`${datetimeToClient(chat.updatedAt)}: ${chat.lastMessage}`}
        </span>
      ) : "";
  };

  const getItemStyle = (chat) => {
    return {
      borderLeft: chat.uuid === id ? "6px solid #002d6e" : null,
      backgroundColor: chat.uuid === id ? "theme.palette.chatlist" : null,
    };
  };

  return (
    <>
      <div>
        <h1 className={classes.tt}>Chat Interno</h1>
        <div className={classes.ln}></div>
      </div>
      <ConfirmationModal
        title={"Excluir Conversa"}
        open={confirmationModal}
        onClose={setConfirmModalOpen}
        onConfirm={handleDelete}
      >
        Esta ação não pode ser revertida, confirmar?
      </ConfirmationModal>
      <div className={classes.chatList}>
        <List style={{ width: "100%" }}>
          {Array.isArray(chats) &&
            chats.length > 0 &&
            chats.map((chat, key) => (
              <ListItem
                onClick={() => goToMessages(chat)}
                key={key}
                className={classes.listItem}
                style={getItemStyle(chat)}
                button
              >
                <ListItemText
                  primary={getPrimaryText(chat)}
                  secondary={getSecondaryText(chat)}
                />
                {chat.ownerId === user.id && (
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => {
                        goToMessages(chat).then(() => {
                          handleEditChat(chat);
                        });
                      }}
                      edge="end"
                      aria-label="edit"
                      size="small"
                      style={{ marginRight: 5 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedChat(chat);
                        setConfirmModalOpen(true);
                      }}
                      edge="end"
                      aria-label="delete"
                      size="small"
                    >
                      <DeleteIcon style={{color:"#D3343E",}}/>
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
        </List>
      </div>
    </>
  );
}
