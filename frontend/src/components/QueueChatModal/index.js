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
    backgroundColor: "#0C2454",
    borderRadius: "10px",
    padding: theme.spacing(1),
    margin: theme.spacing(1, 1, 0, 1),
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    display: "inline-block",
    alignSelf: "flex-end",
    wordWrap: "break-word",
    maxWidth: "70%",
  },
  outOfHoursMessage: {
    backgroundColor: "#0C2454",
    borderRadius: "10px",
    padding: theme.spacing(1),
    margin: theme.spacing(1, 1, 0, 1),
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    display: "inline-block",
    alignSelf: "flex-end",
    wordWrap: "break-word",
    maxWidth: "70%",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%", // Garante que o conteúdo ocupe toda a altura do modal
  },
}));

const QueueChatModal = ({ open, onClose, greetingMessage, outOfHoursMessage }) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        maxWidth="424px"
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
        BackdropProps={{
          style: { backgroundColor: 'transparent' },
        }}
        PaperProps={{
          style: {
            borderRadius: 20,
            maxWidth: "370px",
            height: "450px",
            position: 'absolute',
            top: '30%',
            left: '68%',
          },
        }}
      >
        <DialogTitle style={{ color: '#0C2454', textAlign: 'center' }}>
          Mensagens
          <hr className={classes.blueLine} />
        </DialogTitle>
        <DialogContent dividers className={classes.contentWrapper}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {greetingMessage && (
              <div style={{ marginBottom: '8px', color: '#5E605F', fontWeight: 'bold' }}>
                Mensagem de saudação:
              </div>
            )}
            {greetingMessage && (
              <div className={classes.greetingMessage}>
                {greetingMessage}
              </div>
            )}
            {outOfHoursMessage && (
              <div style={{ marginBottom: '8px', color: '#5E605F', fontWeight: 'bold', paddingTop: '10px' }}>
                Mensagem de fora do expediente:
              </div>
            )}
            {outOfHoursMessage && (
              <div className={classes.outOfHoursMessage}>
                {outOfHoursMessage}
              </div>
            )}
          </div>

          {/* O <hr> sempre ficará na base */}
          <hr className={classes.blueLine} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueueChatModal;
