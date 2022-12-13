import React, { useEffect, useState } from 'react'
import { env } from '../../config';
import axios from "axios";
import Swal from 'sweetalert2';
import Model from '../Model';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [longUrl, setLongurl] = useState("")
    const [url, setUrl] = useState([])
    const [data,setData] = useState({})

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    



    //Alert function;
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })




    const getUrl = async () => {

        let data = await axios.get(`${env.api1}/all-Url`);
        setUrl(data.data.data)
    }

    useEffect(() => {
        getUrl()
    }, [])

    // useEffect(()=>{
    //     const timer = setTimeout(()=>{
    //         setLongurl("");
    //     },1000)
    //     return ()=> clearInterval(timer);
    // },[longUrl])


    const handleDelete = async (id) => {
        try {

            
            let v = await axios.delete(`${env.api1}/delete-short/${id}`,{
                headers: {
                  authorization: window.localStorage.getItem("token")
                }});
            const { data } = v;
            const { message, statusCode } = data
            if (statusCode === 200) {
                getUrl()
                Toast.fire({ icon: 'success', title: message })
            }
             else if(statusCode === 401){
                setData({message})
                setShow(true)
            }
            else {
                
                Toast.fire({ icon: 'error', title: message })

            }
        } catch (error) {
            console.log(error);
        }

    }

    const handleUrl = async (e) => {
       
        e.preventDefault()
        try {
            let v = await axios.post(`${env.api1}/create-url`, { longUrl },{
                headers: {
                  authorization: window.localStorage.getItem("token")
                }});
            const { data } = v;
            const { message, statusCode } = data
            if (statusCode === 201) {
                getUrl()
                setLongurl("")
                Toast.fire({ icon: 'success', title: message })

            } else if (statusCode === 400) {
                Toast.fire({ icon: 'warning', title: message })
            }
            else if(statusCode === 401){
                setData({message})
                setShow(true)
            }
            else {
                
                Toast.fire({ icon: 'error', title: message })
            }

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>

            <div class="container">
                <div class="row fixeds ">
                    <div class="col-lg-12 text-center text-light">
                        <h1>URL Shortener</h1>
                    </div>
                
                <form onSubmit={handleUrl}>
                    <div class="row">
                        <div class="input-group mb-3">
                            <input type="text" name="longurl" class="form-control shadow-none" placeholder="Paste your long URL"
                                aria-label="Recipient's username" aria-describedby="button-addon2" value={longUrl} onChange={(e) => setLongurl(e.target.value)} />
                            <div class="input-group-append">
                                <input type="submit" class="btn btn-outline-secondary" value="Submit" />
                            </div>
                        </div>
                    </div>
                </form>
                </div>
                <div class="row">


                    {
                        url.length > 0 && url.map((item, index) => {
                            return <div class="col-lg-3" key={index}>
                                <div class="card border-secondary mb-3 mx-auto boxs" >
                                    <div class="card-header">Total Click : {item.clickCount}</div>
                                    <div class="card-body text-secondary">
                                        <h6 class="card-title">
                                            Short Url : <br />
                                            <a href={`${env.redirect}/${item.shortUrl}`} target="_blank" rel="noopener noreferrer" >{`${env.redirect}/${item.shortUrl}`}</a>
                                        </h6>
                                        Long Url : <br />
                                       <h6 className='long-url'>
                                       
                                        <a href={item.longUrl} target="_blank" rel="noopener noreferrer" >{item.longUrl}</a>
                                       </h6>
                                    </div>
                                    <button type="button" class="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                </div>
                            </div>
                        })
                    }


                </div>
            </div>
<Model show={show}
      
        handleClose = {handleClose}
handleShow = {handleShow}
data = {data}
/>
<div className='logout' onClick={() => {
          window.localStorage.removeItem("token")
          
          navigate("/")}}>
<img src="./img/logout1.png" alt="logout"   />
</div>
        </div>
    )
}

export default Home