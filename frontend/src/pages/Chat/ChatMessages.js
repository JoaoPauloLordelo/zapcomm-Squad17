import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    flex: 1,
    overflow: "hidden",
    borderRadius: 0,
    height: "95%",
    width: "30%",
    borderLeft: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "#F5F4F3",
    borderRadius: "15px",
    top: "16%",
    left: "65%",
    bottom: "0",
    zIndex: "1000",
    transform: "scale(0.75)",
  },
  chatTitleContainer: {
    // Aplique o estilo desejado aqui para o título do chat
    textAlign: "center",
    padding: theme.spacing(2),
    fontWeight: "bold",
    height:"",
  },
  messageList: {
    position: "relative",
    overflowY: "auto",
    height: "73.5%",
    width: "100%",
    maxWidth: "500px",
    ...theme.scrollbarStyles,
    backgroundColor: "#F5F4F3",
    top: "30px",
    overflow:"hidden",
  },
  inputArea: {
    position: "relative",
    height: "10%",
    top: "55px",
    width: "80%",
    left: "10%",
    borderRadius: "16px",
  },
  bord: {
    position: "relative",
    width: "90%",
    height: "100%",
    backgroundColor: "white",
    border: "2px solid #0C2454",
    borderRadius: "16px",
    zIndex: "1",
  },
  input: {
    padding: "20px",
    backgroundColor: "#E2E2E2",
    borderRadius: "16px",
    position: "relative",
    bottom: "5%",
    border: "2px solid #0C2454",
  },
  buttonSend: {
    margin: theme.spacing(1),
  },
  boxLeft: {
    padding: "10px 10px 5px",
    margin: "10px 10px 10px auto",
    position: "relative",
    backgroundColor: "#9AE2A9",
    textAlign: "right",
    maxWidth: "60%",
    maxHeight: "15%",
    borderRadius: 10,
    borderBottomRightRadius: 0,
    border: "1px solid rgba(0, 0, 0, 0.12)",
  },
  boxRight: {
    padding: "10px 10px 5px",
    margin: "10px 10px 10px auto",
    position: "relative",
    backgroundColor: "#ADC9CD",
    textAlign: "right",
    maxWidth: "60%",
    maxHeight: "15%",
    borderRadius: 10,
    borderBottomRightRadius: 0,
    border: "1px solid rgba(0, 0, 0, 0.12)",
  },
  line: {
    width: "90%",
    height: "2px",
    top: "5%",
    left: "5%",
    backgroundColor: "#0C2454",
    position: "relative",
    zIndex: "5",
  },
  line2: {
    width: "90%",
    height: "2px",
    backgroundColor: "#0C2454",
    position: "relative",
    zIndex: "5",
    top: "80%",
    left: "5%",
  },
  data: {
    position: "relative",
    right: "5%",
    bottom: "200%",
    maxWidth: "40%",
    zIndex: "10",
    transform: "scale(0.75)",
  },
}));

export default function ChatMessages({
  chat,
  messages,
  handleSendMessage,
  handleLoadMore,
  scrollToBottomRef,
  pageInfo,
  loading,
}) {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { datetimeToClient } = useDate();
  const baseRef = useRef();

  const [contentMessage, setContentMessage] = useState("");

  const scrollToBottom = () => {
    if (baseRef.current) {
      baseRef.current.scrollIntoView({});
    }
  };

  const unreadMessages = (chat) => {
    if (chat !== undefined) {
      const currentUser = chat.users.find((u) => u.userId === user.id);
      return currentUser.unreads > 0;
    }
    return 0;
  };

  useEffect(() => {
    if (unreadMessages(chat) > 0) {
      try {
        api.post(`/chats/${chat.id}/read`, { userId: user.id });
      } catch (err) {}
    }
  }, []);

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (!pageInfo.hasMore || loading) return;
    if (scrollTop < 600) {
      handleLoadMore();
    }
  };

  return (
    <Paper className={classes.mainContainer}>
      {/* Contêiner do título do chat selecionado */}
      <div className={classes.chatTitleContainer}>
        <Typography variant="h6">
          {chat ? chat.title : "Selecione um chat"}
        </Typography>
      </div>
      
      <div className={classes.line}></div>
      <div className={classes.line2}></div>
      <div onScroll={handleScroll} className={classes.messageList}>
        {Array.isArray(messages) &&
          messages.map((item, key) => {
            if (item.senderId === user.id) {
              return (
                <Box key={key} className={classes.boxRight}>
                  <Typography variant="subtitle2">
                    {item.sender.name}
                  </Typography>
                  {item.message}
                  <Typography variant="caption" display="block" style={{position:"relative",
                    bottom:"50px",
                    right:"140px",
                  }}>
                    {datetimeToClient(item.createdAt)}
                  </Typography>
                </Box>
              );
            } else {
              return (
                <Box key={key} className={classes.boxLeft}>
                  <Typography variant="subtitle2">
                    {item.sender.name}
                  </Typography>
                  {item.message}
                  <Typography variant="caption" display="block">
                    {datetimeToClient(item.createdAt)}
                  </Typography>
                </Box>
              );
            }
          })}
        <div ref={baseRef}></div>
      </div>
      <div className={classes.inputArea}>
        <FormControl variant="outlined" fullWidth>
          <Input
            multiline
            value={contentMessage}
            onKeyUp={(e) => {
              if (e.key === "Enter" && contentMessage.trim() !== "") {
                handleSendMessage(contentMessage);
                setContentMessage("");
              }
            }}
            onChange={(e) => setContentMessage(e.target.value)}
            className={classes.input}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    if (contentMessage.trim() !== "") {
                      handleSendMessage(contentMessage);
                      setContentMessage("");
                    }
                  }}
                  className={classes.buttonSend}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
            disableUnderline
          />
        </FormControl>
        <div className={classes.line2}></div>
      </div>
    </Paper>
  );
}
