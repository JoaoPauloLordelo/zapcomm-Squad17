import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogTitle, DialogContent, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  blueLine: {
    border: 0,
    height: "2px",
    width: "100%",
    backgroundColor: "#0C2454",
  },
  greetingMessage: {
    backgroundColor: "#0C2454", // Cor de fundo para a mensagem
    borderRadius: "10px",
    padding: theme.spacing(1),
    margin: theme.spacing(1, 1, 0, 1), // Espaçamento (cima, direita, baixo, esquerda)
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    display: "inline-block", // Para ajustar o tamanho ao conteúdo
    alignSelf: "flex-end", // Para alinhar à direita
    wordWrap: "break-word",
    maxWidth: "70%", // Limita a largura da mensagem
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%", // O conteúdo vai ocupar toda a altura
    justifyContent: "space-between", // Deixa o conteúdo no meio e o input na base
  },
  bottomSection: {
    marginTop: theme.spacing(2), // Espaçamento acima do input
    paddingBottom: theme.spacing(1), // Espaçamento na base
  },
}));

const QueueChatModal = ({ open, onClose, greetingMessage }) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        maxWidth="424px" // Define a largura do modal
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
        BackdropProps={{
          style: { backgroundColor: 'transparent' }, // Altera a cor do fundo para transparente
        }}
        PaperProps={{
          style: {
            borderRadius: 20,
            maxWidth: "370px",
            height: "450px", // Define a altura do modal
            position: 'absolute', // Necessário para usar top e left
            top: '20%', // Deslocamento do topo
            left: '68%', // Deslocamento da esquerda
          },
        }}
      >
        <DialogTitle style={{ color: '#0C2454', textAlign: 'center' }}>
          ChatBot
          <hr className={classes.blueLine} />
        </DialogTitle>
        <DialogContent dividers className={classes.contentWrapper}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {/* Exibir a mensagem de saudação como mensagem de chat */}
            {greetingMessage && (
              <div className={classes.greetingMessage}>
                {greetingMessage}
              </div>
            )}
          </div>

          {/* Input e hr na base */}
          <div className={classes.bottomSection}>
            <hr className={classes.blueLine} />
            <TextField
              label="Insira sua mensagem" // Texto do input
              fullWidth
              variant="outlined"
              margin="dense"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueueChatModal;
