import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import api from "../../services/api";

import { i18n } from "../../translate/i18n";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import ConfirmationModal from "../../components/ConfirmationModal";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    borderRadius: "16px"
  },
  textRight: {
    textAlign: "right",
  },
  tabPanelsContainer: {
    padding: theme.spacing(2),
  },
  select: {
    backgroundColor: '#cccccc',
    '& .MuiSelect-select': {
      color: '#808080',
    },
    '& .MuiSelect-select:focus': {
      color: '#0C2454',
    },
    '& .MuiInputLabel-root': {
      color: '#808080',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#0C2454',
    },
  }
}));

const initialSettings = {
  messageInterval: 20,
  longerIntervalAfter: 20,
  greaterInterval: 60,
  variables: [],
};

const CampaignsConfig = () => {
  const classes = useStyles();

  const [settings, setSettings] = useState(initialSettings);
  const [showVariablesForm, setShowVariablesForm] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [variable, setVariable] = useState({ key: "", value: "" });

  useEffect(() => {
    api.get("/campaign-settings").then(({ data }) => {
      const settingsList = [];
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((item) => {
          settingsList.push([item.key, JSON.parse(item.value)]);
        });
        setSettings(Object.fromEntries(settingsList));
      }
    });
  }, []);

  const handleOnChangeVariable = (e) => {
    if (e.target.value !== null) {
      const changedProp = {};
      changedProp[e.target.name] = e.target.value;
      setVariable((prev) => ({ ...prev, ...changedProp }));
    }
  };

  const handleOnChangeSettings = (e) => {
    const changedProp = {};
    changedProp[e.target.name] = e.target.value;
    setSettings((prev) => ({ ...prev, ...changedProp }));
  };

  const addVariable = () => {
    setSettings((prev) => {
      const variablesExists = settings.variables.filter(
        (v) => v.key === variable.key
      );
      const variables = prev.variables;
      if (variablesExists.length === 0) {
        variables.push(Object.assign({}, variable));
        setVariable({ key: "", value: "" });
      }
      return { ...prev, variables };
    });
  };

  const removeVariable = () => {
    const newList = settings.variables.filter((v) => v.key !== selectedKey);
    setSettings((prev) => ({ ...prev, variables: newList }));
    setSelectedKey(null);
  };

  const saveSettings = async () => {
    await api.post("/campaign-settings", { settings });
    toast.success("Configurações salvas");
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={i18n.t("campaigns.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={removeVariable}
      >
        {i18n.t("campaigns.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <Paper className={classes.mainPaper} variant="outlined" style={{borderRadius: "16px"}}>
        <h1 style={{color:'#0C2C4C'}}>Configurações de campanha</h1>
        <Box className={classes.tabPanelsContainer}>
          <Grid spacing={2} container>
            <Grid xs={12} item>
              <Typography component={"h3"} style={{color:"#0C2C4C", fontWeight: "bold", fontSize: "22px"}}>Intervalos</Typography>
            </Grid>
            <Grid xs={12} md={4} item>
              <Typography variant="subtitle1" style={{color: "#0C2C4C", marginBottom: "8px", fontWeight: "bold"}}>
                Intervalo Randômico de Disparo
              </Typography>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <Select
                  name="messageInterval"
                  id="messageInterval"
                  value={settings.messageInterval}
                  onChange={(e) => handleOnChangeSettings(e)}
                  className={classes.select}
                >
                  <MenuItem value={0}>Sem Intervalo</MenuItem>
                  <MenuItem value={5}>5 segundos</MenuItem>
                  <MenuItem value={10}>10 segundos</MenuItem>
                  <MenuItem value={15}>15 segundos</MenuItem>
                  <MenuItem value={20}>20 segundos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={4} item>
              <Typography variant="subtitle1" style={{color: "#0C2C4C", marginBottom: "8px", fontWeight: "bold"}}>
                Intervalo Maior Após
              </Typography>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <Select
                  name="longerIntervalAfter"
                  id="longerIntervalAfter"
                  value={settings.longerIntervalAfter}
                  onChange={(e) => handleOnChangeSettings(e)}
                  className={classes.select}
                >
                  <MenuItem value={0}>Não definido</MenuItem>
                  <MenuItem value={1}>1 segundo</MenuItem>
                  <MenuItem value={5}>5 segundos</MenuItem>
                  <MenuItem value={10}>10 segundos</MenuItem>
                  <MenuItem value={15}>15 segundos</MenuItem>
                  <MenuItem value={20}>20 segundos</MenuItem>
                  <MenuItem value={30}>30 segundos</MenuItem>
                  <MenuItem value={40}>40 segundos</MenuItem>
                  <MenuItem value={60}>60 segundos</MenuItem>
                  <MenuItem value={80}>80 segundos</MenuItem>
                  <MenuItem value={100}>100 segundos</MenuItem>
                  <MenuItem value={120}>120 segundos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={4} item>
              <Typography variant="subtitle1" style={{color: "#0C2C4C", marginBottom: "8px", fontWeight: "bold"}}>
                Intervalo de Disparo Maior
              </Typography>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <Select
                  name="greaterInterval"
                  id="greaterInterval"
                  value={settings.greaterInterval}
                  onChange={(e) => handleOnChangeSettings(e)}
                  className={classes.select}
                >
                  <MenuItem value={0}>Sem Intervalo</MenuItem>
                  <MenuItem value={1}>1 segundo</MenuItem>
                  <MenuItem value={5}>5 segundos</MenuItem>
                  <MenuItem value={10}>10 segundos</MenuItem>
                  <MenuItem value={15}>15 segundos</MenuItem>
                  <MenuItem value={20}>20 segundos</MenuItem>
                  <MenuItem value={30}>30 segundos</MenuItem>
                  <MenuItem value={40}>40 segundos</MenuItem>
                  <MenuItem value={60}>60 segundos</MenuItem>
                  <MenuItem value={80}>80 segundos</MenuItem>
                  <MenuItem value={100}>100 segundos</MenuItem>
                  <MenuItem value={120}>120 segundos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} className={classes.textRight} item>
              <Button
                onClick={() => setShowVariablesForm(!showVariablesForm)}
                style={{
                  marginRight: 10,
                  backgroundColor: 'white',
                  color: '#0C2C4C',
                  border: '1px solid #0C2C4C',
                }}
              >
                Adicionar Variável
              </Button>
              <Button
                onClick={saveSettings}
                style={{
                  backgroundColor: '#0C2C4C',
                  color: '#fff',
                  
                }}
              >
                Salvar Configurações
              </Button>
            </Grid>
            {showVariablesForm && (
              <>
                <Grid xs={12} md={6} item>
                  <Typography variant="subtitle1" style={{color: "#0C2C4C", marginBottom: "8px", fontWeight: "bold"}}>
                    Atalho
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={variable.key}
                    name="key"
                    onChange={handleOnChangeVariable}
                    style={{backgroundColor: "rgb(217, 217, 217)", width: "80%"}}
                  />
                </Grid>
                <Grid xs={12} md={6} item>
                  <Typography variant="subtitle1" style={{color: "#0C2C4C", marginBottom: "8px", fontWeight: "bold"}}>
                    Conteúdo
                  </Typography>
                  <TextField
                    variant="outlined"
                    value={variable.value}
                    name="value"
                    onChange={handleOnChangeVariable}
                    style={{backgroundColor: "rgb(217, 217, 217)", width: "80%"}}
                  />
                </Grid>
                <Grid xs={12} className={classes.textRight} item>
                  <Button
                    onClick={() => setShowVariablesForm(!showVariablesForm)}
                    color="primary"
                    style={{ marginRight: 10 , backgroundColor: '#D3343E', color: '#fff'}}
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={addVariable}
                    color="primary"
                    variant="contained"
                  >
                    Adicionar
                  </Button>
                </Grid>
              </>
            )}
            {settings.variables.length > 0 && (
              <Grid xs={12} className={classes.textRight} item>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "1%" }}></TableCell>
                      <TableCell>Atalho</TableCell>
                      <TableCell>Conteúdo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(settings.variables) &&
                      settings.variables.map((v, k) => (
                        <TableRow key={k}>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedKey(v.key);
                                setConfirmationOpen(true);
                              }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>{"{" + v.key + "}"}</TableCell>
                          <TableCell>{v.value}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </MainContainer>
  );
};

export default CampaignsConfig;
