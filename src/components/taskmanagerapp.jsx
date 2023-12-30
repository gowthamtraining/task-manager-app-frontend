import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from '@mui/material/Button';
import { ButtonGroup, Card, CardContent, Checkbox, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {toast} from "react-toastify"
import { url } from "../App";
import CircularProgress from '@mui/material/CircularProgress';



const TaskManagerApp = () => {
    const [taskkdata, settaskdata] = useState([]);
    const [name, setname] = useState("");
    const [id,setid] = useState()
    const [isloading,setisloading] = useState(true)
    const [editable,seteditable] = useState(false)
    

    const fetchtaskdata = async () => {
        try {
            const res = await axios.get(`${url}api/task`,{
                headers:{
                    "Content-Type":""
                }
            });
            setisloading(false)
            settaskdata(res.data);
           
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchtaskdata();
        
    }, []);

    const onsubmit = async () => {

        if(editable===true){
            await axios.put(`${url}api/task/${id}`,{name},{
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
            await axios.post(`${url}api/task`, { name }, {
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
        axios.delete(`${url}api/task/${id}`,{
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
        axios.get(`${url}/${id}`).then((res)=>{
            if(res){
            seteditable(!editable)
            setid(id)
            setname(res.data.name)  
            }
        })
    }
    const selecteditem=(id)=>{
        axios.get(`${url}api/task/${id}`).then((res)=>{
            if(res){
               axios.put(`${url}api/task/${id}`,{name:res.data.name,complete:!res.data.complete}).then((res)=>{
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
            {isloading===true?(
                <Card sx={{ maxWidth: '40%', margin: '30px auto', '@media (max-width: 600px) ': { maxWidth: '90%' },'@media (max-width:768px)':{maxWidth:'60%'},'@media (max-width:426px)':{maxWidth:'90%'} }}>
                <CircularProgress/>
                </Card>
            ):(
                  <form>
                  <Card sx={{ maxWidth: '40%', margin: '30px auto', '@media (max-width: 600px) ': { maxWidth: '90%' },'@media (max-width:768px)':{maxWidth:'60%'},'@media (max-width:426px)':{maxWidth:'90%'} }}>
                      <CardContent>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                              <Typography fontSize={30} sx={{ fontSize: { xs: 13, sm: 20,md:25 },textAlign:"center" }}>Task-Manager</Typography>
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
                                      variant="contained"
                                    style={{borderRadius: '50%',
                                    minWidth: '50px',
                                    height: '40px',
                                    padding: 0,
                                    boxShadow: "0 0 10px blue)"
                            


                                    
                                }}
                                      
                                      onClick={() => onsubmit()}
                                  >
                                    <AddIcon/>
                                  </Button>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                  <Typography style={{fontSize:"14px"}}>No Of Tasks: {taskkdata.length}</Typography>
                                  <Typography style={{fontSize:"14px"}}>No of Tasks Completed:{taskkdata.filter((res)=>res.complete === true).length}</Typography>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                  {taskkdata.map((item) => (
                                      <div
                                          key={item._id}
                                          style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                              
                                              padding: "5px 7px",
                                              borderRadius: "5px",
                                              boxShadow: item.complete ? "0 0 10px rgba(0, 0, 0, 0.1)" : "none"

                                          }}
                                          
                                      >
                                        <Checkbox icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} checked={item.complete}   onClick={()=>selecteditem(item._id)}/>
                                          <Typography>{item.name}</Typography>
                                          <ButtonGroup size="small">
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
            )}
          
        </div>
    );
};

export default TaskManagerApp;
