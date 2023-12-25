import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import { ButtonGroup, Card, CardContent, TextField, Typography } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import {toast} from "react-toastify"
import { url } from "../App";



const TaskManagerApp = () => {
    const [taskkdata, settaskdata] = useState([]);
    const [name, setname] = useState("");
    const [id,setid] = useState()
    const [editable,seteditable] = useState(false)

    const fetchtaskdata = async () => {
        try {
            const res = await axios.get(`${url}/api/task`);
            settaskdata(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchtaskdata();
    }, []);
    // console.log(getValues("id"))
    const onsubmit = async () => {

        if(editable===true){
            await axios.put(`${url}/api/task/${id}`,{name},{
                headers:{
                    "Content-Type":"application/json"
                }
            }).then((res)=>{
                if(res){
                    fetchtaskdata()
                    toast.success("data updated")
                    setname("")
                }
            })
        }
        else{
        try {
            await axios.post(`${url}/api/task`, { name }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            fetchtaskdata();
            toast.success("data created")
            setname(""); // Clear the input after submission
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    }
    };
    const DeleteTaskById =(id)=>{
        axios.delete(`${url}/api/task/${id}`,{
            headers:{
                "Content-Type":""
            }
        }).then((res)=>{
            if(res){
                fetchtaskdata()
                toast.success("data deleted")
            }
        })
    }
    const gettaskbyid =(id)=>{
        axios.get(`${url}/api/task/${id}`).then((res)=>{
            if(res){
            seteditable(!editable)
            setid(id)
            setname(res.data.name)  
            }
        })
    }
    const selecteditem=(id)=>{
        axios.get(`${url}/api/task/${id}`).then((res)=>{
            if(res){
               axios.put(`${url}/api/task/${id}`,{name:res.data.name,complete:!res.data.complete}).then((res)=>{
                fetchtaskdata()
                if(res.data.complete){
                toast.success("data selected")
                }
                else{
                    toast.error("Data dis selected")
                }
               })
            }
        })
    }

    return (
        <div>
            <form>
                <Card style={{ maxWidth: "30%", margin: "30px auto" }}>
                    <CardContent>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Typography fontSize={30}>Task-Manager</Typography>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <TextField
                                    label="name"
                                    size="small"
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                    type="string"
                                    fullWidth
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<AddBoxIcon />}
                                    onClick={() => onsubmit()}
                                >
                                   {editable?"edit":"Add"}
                                </Button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography style={{fontSize:"14px"}}>No Of Tasks: {taskkdata.length}</Typography>
                                <Typography style={{fontSize:"14px"}}>No of Tasks Completed:{taskkdata.filter((res)=>res.complete === true).length}</Typography>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {taskkdata.map((item) => (
                                    <div
                                        key={item._id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            border: "1px solid black",
                                            padding: "5px 7px",
                                            borderRadius: "5px",
                                        }}
                                    >
                                        <Typography>{item.name}</Typography>
                                        <ButtonGroup size="small">
                                            <Button size="small">
                                                {item.complete?
                                                <CheckIcon fontSize="small" onClick={()=>selecteditem(item._id)} />:<CloseIcon fontSize="small" onClick={()=>selecteditem(item._id)}/>}
                                            </Button>
                                            <Button size="small" onClick={()=>DeleteTaskById(item._id)}>
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                            <Button size="small" onClick={()=>gettaskbyid(item._id)}>
                                                <SaveIcon fontSize="small" />
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default TaskManagerApp;
