import React, { useEffect, useState } from "react"; 
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
    chips: {
        display: "flex",
        flexWrap: "wrap",
    },
    chip: {
        margin: 2,
    },
    queueSelect: {
        position: "relative",
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#0C2454', // Cor da borda azul
            },
            '&:hover fieldset': {
                borderColor: '#0C2454',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#0C2454',
            },
        },
    },
    inputLabel: {
        color: "#9E9E9E", // Cor cinza para o rótulo
        backgroundColor: "#fff", // Fundo branco para o rótulo
        padding: "0 8px",
        position: "absolute",
        left: 14,
        top: "4px", // Ajuste para alinhar com a borda
        zIndex: 1,
        fontSize: "1rem", // Aumento do tamanho da fonte
        transform: "translate(0, 50%)",
        borderRadius: "4px", // Bordas arredondadas
    },
}));

const QueueSelect = ({ selectedQueueIds, onChange, multiple = true, title = i18n.t("queueSelect.inputLabel") }) => {
    const classes = useStyles();
    const [queues, setQueues] = useState([]);

    useEffect(() => {
        fetchQueues();
    }, []);

    const fetchQueues = async () => {
        try {
            const { data } = await api.get("/queue");
            setQueues(data);
        } catch (err) {
            toastError(err);
        }
    };

    const handleChange = e => {
        onChange(e.target.value);
    };

    return (
        <div>
            <FormControl fullWidth margin="dense" variant="outlined" className={classes.queueSelect}>
                <InputLabel shrink={selectedQueueIds ? true : false} className={classes.inputLabel}>
                    {title}
                </InputLabel>
                <Select
                    label={title}
                    multiple={multiple}
                    value={selectedQueueIds}
                    onChange={handleChange}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                        },
                        getContentAnchorEl: null,
                    }}
                    renderValue={selected => {
                        return (
                            <div className={classes.chips}>
                                {selected?.length > 0 && multiple ? (
                                    selected.map(id => {
                                        const queue = queues.find(q => q.id === id);
                                        return queue ? (
                                            <Chip
                                                key={id}
                                                style={{ backgroundColor: queue.color }}
                                                variant="outlined"
                                                label={queue.name}
                                                className={classes.chip}
                                            />
                                        ) : null;
                                    })
                                ) : (
                                    <Chip
                                        key={selected}
                                        variant="outlined"
                                        style={{ backgroundColor: queues.find(q => q.id === selected)?.color }}
                                        label={queues.find(q => q.id === selected)?.name}
                                        className={classes.chip}
                                    />
                                )}
                            </div>
                        );
                    }}
                >
                    {!multiple && <MenuItem value={null}>Nenhum</MenuItem>}
                    {queues.map(queue => (
                        <MenuItem key={queue.id} value={queue.id}>
                            {queue.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default QueueSelect;
