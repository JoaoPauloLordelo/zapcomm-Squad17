import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";
import logo from "../../assets/logo.png"; //PLW DESIGN LOGO//
import { i18n } from "../../translate/i18n";
import Quickemessages from ".././QuickMessages/index.js";

const useStyles = makeStyles(theme => ({
	chatContainer: {
		flex: 1,
		backgroundColor: "#34d3a3", // Cor de fundo secundária
		padding: theme.spacing(1),
		height: `calc(100% - 48px)`,
		overflowY: "hidden",
		paddingTop: "70px",
		width: "100%", // Ajuste para o layout ocupar 100% da largura
		display: "flex",
		flexDirection: "column",
	},
	chatPapper: {
		backgroundColor: "#0C2454",
		display: "flex",
		height: "100%",
		width: "100%",
		border: "4px solid #0C2454",
		font: "Inter",
		borderradius: "8px",
	},

	contactsWrapper: {
		height: "70%", // Ajustando para que a lista de tickets ocupe 70% da tela
		overflowY: "auto", // Para permitir rolagem caso haja muitos tickets
		marginBottom: theme.spacing(2), // Espaço embaixo para separar do campo de respostas rápidas
	},
	messagesWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflowY: "hidden",
	},

	welcomeMsg: {
		backgroundColor: theme.palette.boxticket,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
	},
	quickMessages: {
        padding: theme.spacing(2),
        backgroundColor: "#ffff", // Destaque leve no fundo
        width: "100%",
        height: "100%", // Preenche completamente o contêiner
		textAlign: "left"
		},
	

}));

const TicketsCustom = () => {
	const classes = useStyles();
	const { ticketId } = useParams();

	return (
							<Grid container spacing={0}>
						<Grid item xs={12} className={classes.contactsWrapper}>
							<TicketsManager />
						</Grid>
						<Grid item xs={12} className={classes.messagesWrapper}>
							{ticketId ? (
								<>
									<Ticket />
								</>
							) : (
								<Paper square variant="outlined" className={classes.welcomeMsg}>
									{/* PLW DESIGN LOGO */}
									
									<div className={classes.quickMessages}>
										<Quickemessages />
										<div className={classes.traco}>
									</div>
									</div>
								</Paper>
							)}
						</Grid>
					</Grid>

	);
};

export default TicketsCustom;
