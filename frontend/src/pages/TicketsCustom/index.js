import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Quickemessages from "../QuickMessages";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { InputAdornment } from "@material-ui/core";
import TicketsQueueSelect from "../../components/TicketsQueueSelect";
import { UsersFilter } from "../../components/UsersFilter";
import { TagsFilter } from "../../components/TagsFilter";
import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";
import logo from "../../assets/logo.png"; //PLW DESIGN LOGO//
import { i18n } from "../../translate/i18n";
import { Title } from "@material-ui/icons";



const useStyles = makeStyles(theme => ({
	chatContainer: {
		flex: 1,
		// backgroundColor: "#eee",
		padding: theme.spacing(1), //Aqui ele ajusta espaço na tela de ticket
		height: `calc(100% - 48px)`,
		overflowY: "auto",
		margin: 'auto',
		paddingTop: '70px',
		width: '80%',
	},

	chatPapper: {
		// backgroundColor: "red",
		display: "flex",
		height: "100%",
		overflow: 'auto'
		
	},
	searchIcon: {
		color: "grey",
		marginLeft: 6,
		marginRight: 6,
		alignSelf: "center",
	},
	blueLine: {
		border: 0,
		height: "2px",
		backgroundColor: theme.palette.primary.main, // Azul da cor primária do tema
		margin: theme.spacing(2, 0), // Espaçamento vertical
	  },
	contactsWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflowY: "auto",
	},
	searchInput: {
		width: '500px', // Ajuste o valor conforme necessário
		border: "none",
		height: '50px',
		marginTop: '16px',
		borderRadius: 16,
		backgroundColor: "#D9D9D9",
	  },
	serachInputWrapper: {
		flex: 1,
		background: theme.palette.total,
		display: "flex",
		borderRadius: 40,
		padding: 4,
		marginRight: theme.spacing(1),
	},
	headerContainer: {
		display: 'flex',
		alignitems: 'center', /* Alinha verticalmente os itens */
		marginbottom: '16px', /* Espaço entre o header e o restante do conteúdo */
	  },
	messagesWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
	},
	welcomeMsg: {
		backgroundColor: theme.palette.boxticket, //DARK MODE PLW DESIGN//
		display: "flex",
		justifyContent: "space-evenly",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
	},
}));


const TicketsCustom = () => {
	const classes = useStyles();
	const { ticketId } = useParams();

	return (
		<div className={classes.chatContainer}>
		  <Paper className={classes.chatPaper} elevation={3} style={{ padding: '8px' }}>
			<div className={classes.headerContainer}>
			  <h1 style={{ color: '#0C2454', marginRight: '16px' }}>Chamados</h1>
			  
			  <div className={classes.serachInputWrapper} style={{ marginLeft: '350px' }}>
				
				<InputBase
				  className={classes.searchInput}
				  placeholder={i18n.t("tickets.search.placeholder")}
				  type="search"
				  startAdornment={
					<InputAdornment position="start">
					  <SearchIcon className={classes.searchIcon} />
					</InputAdornment>
				  }
				/>
				<TagsFilter style={{ marginLeft: '8px', marginTop: '8px' }}/>
				<UsersFilter style={{ marginLeft: '8px', marginTop: '8px' }}/>
			  </div>
			</div>
			<hr className={classes.blueLine} />
			
			<Grid container spacing={0}>
			  <Grid item xs={12} className={classes.contactsWrapper}>
				<TicketsManager />
			  </Grid>
			  <Grid item xs={8} className={classes.messagesWrapper}>
				{/* Mensagens podem ser adicionadas aqui */}
			  </Grid>
			</Grid>
			<Quickemessages />
		  </Paper>
		</div>
	  );
};

export default TicketsCustom;
