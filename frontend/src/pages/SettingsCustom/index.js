import React, { useState, useEffect } from "react";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { makeStyles, Paper, Tabs, Tab, useMediaQuery } from "@material-ui/core";

import TabPanel from "../../components/TabPanel";

import SchedulesForm from "../../components/SchedulesForm";
import CompaniesManager from "../../components/CompaniesManager";
import PlansManager from "../../components/PlansManager";
import HelpsManager from "../../components/HelpsManager";
import Options from "../../components/Settings/Options";


import { i18n } from "../../translate/i18n.js";
import { toast } from "react-toastify";

import useCompanies from "../../hooks/useCompanies";
import useAuth from "../../hooks/useAuth.js";
import useSettings from "../../hooks/useSettings";

import OnlyForSuperUser from "../../components/OnlyForSuperUser";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    height: '100%',
    marginTop: '80px',
    marginLeft: '5%',
    overflowX: 'hidden',
    },
  
  tab: {
    backgroundColor: theme.palette.options,
    border: `1px solid #0C2454`,
    flexGrow: 1,
    fontSize: "1.2rem",
    "&.Mui-selected": {
      backgroundColor: "#0C2454",
      color: "white",
    },
    "&:first-child": {
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    "&:last-child": {
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
      padding: theme.spacing(1),
    },
  },
  paper: {
    ...theme.scrollbarStyles,
    overflowY: "scroll",
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    width: "100%",
    borderRadius: "16px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      padding: theme.spacing(1),
    },
  },
  container: {
    width: "100%",
    maxHeight: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },
  control: {
    padding: theme.spacing(1),
  },
  textfield: {
    width: "100%",
  },
  traco: {
    height: "2px",
    width: "97%",
    backgroundColor: "#0C2454",
    marginBottom: "20px",
    marginLeft: "20px",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      marginLeft: "5%",
    },
  },
  titulo: {
    fontSize: "25px",
    marginLeft: "20px",
    marginTop: "20px",
    color: "#0c2c54",
    [theme.breakpoints.down("sm")]: {
      fontSize: "20px",
      marginLeft: "10px",
      marginTop: "10px",
      textAlign: "center",
    },
  },
  tabs: {
    display: "flex",
    width: "90%",
    marginLeft: "66px",
    marginBottom: "15px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginLeft: "0",
    },
  },
}));

const SettingsCustom = () => {
  const classes = useStyles();
  const [tab, setTab] = useState("options");
  const [schedules, setSchedules] = useState([]);
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [settings, setSettings] = useState({});
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);

  const { getCurrentUserInfo } = useAuth();
  const { find, updateSchedules } = useCompanies();
  const { getAll: getAllSettings } = useSettings();

  useEffect(() => {
    async function findData() {
      setLoading(true);
      try {
        const companyId = localStorage.getItem("companyId");
        const company = await find(companyId);
        const settingList = await getAllSettings();
        setCompany(company);
        setSchedules(company.schedules);
        setSettings(settingList);

        if (Array.isArray(settingList)) {
          const scheduleType = settingList.find(
            (d) => d.key === "scheduleType"
          );
          if (scheduleType) {
            setSchedulesEnabled(scheduleType.value === "company");
          }
        }

        const user = await getCurrentUserInfo();
        setCurrentUser(user);
      } catch (e) {
        toast.error(e);
      }
      setLoading(false);
    }
    findData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSubmitSchedules = async (data) => {
    setLoading(true);
    try {
      setSchedules(data);
      await updateSchedules({ id: company.id, schedules: data });
      toast.success("Horários atualizados com sucesso.");
    } catch (e) {
      toast.error(e);
    }
    setLoading(false);
  };

  const isSuper = () => {
    return currentUser.super;
  };

  return (
    
      <Paper className={classes.mainPaper} elevation={1}>
        <div className={classes.titulo}>Configurações</div>
        <div className={classes.traco}></div>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          scrollButtons="on"
          variant="fullWidth"
          onChange={handleTabChange}
          className={classes.tabs}
        >
          <Tab label="Opções" value={"options"} classes={{ root: classes.tab }} />
          {isSuper() ? (
            <Tab label="Empresas" value={"companies"} classes={{ root: classes.tab }} />
          ) : null}
          {isSuper() ? (
            <Tab label="Ajuda" value={"helps"} classes={{ root: classes.tab }} />
          ) : null}
        </Tabs>
        <Paper className={classes.paper} elevation={0}>
          <TabPanel className={classes.container} value={tab} name={"schedules"}>
            <SchedulesForm
              loading={loading}
              onSubmit={handleSubmitSchedules}
              initialValues={schedules}
            />
          </TabPanel>
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel className={classes.container} value={tab} name={"companies"}>
                <CompaniesManager />
              </TabPanel>
            )}
          />
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel className={classes.container} value={tab} name={"plans"}>
                <PlansManager />
              </TabPanel>
            )}
          />
          <OnlyForSuperUser
            user={currentUser}
            yes={() => (
              <TabPanel className={classes.container} value={tab} name={"helps"}>
                <HelpsManager />
              </TabPanel>
            )}
          />
          <TabPanel className={classes.container} value={tab} name={"options"}>
            <Options
              settings={settings}
              scheduleTypeChanged={(value) =>
                setSchedulesEnabled(value === "company")
              }
            />
          </TabPanel>
        </Paper>
      </Paper>
  );
};

export default SettingsCustom;
