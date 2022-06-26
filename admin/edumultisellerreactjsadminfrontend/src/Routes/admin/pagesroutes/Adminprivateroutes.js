import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { Redirect, Route,useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import Adminlayout from '../../../Components/Admin/Adminlayout'
import adminauthroutes from '../Authroutes/adminauthroutes'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function Adminprivateroutes({...rest}) {
    const history=useHistory();
    const [Authenticated, setAuthenticated] = useState(false)
     const [loading, setloading] = useState(true)
      useEffect(() => {
          axios.get(adminauthroutes.admin).then(resp=>{
              if(resp.data.status===200){
                setAuthenticated(true); 
              }
              setloading(false)
          }).catch(
              err=>{
                // history.push("/");
                  swal("warning",err.message,"warning")
                });
        return () => {
            setAuthenticated(false);
        };
      }, [])
      axios.interceptors.response.use(undefined,function axiosRetryInterceptor(err){
        if(err.response.status===401){
            // swal("Unauthorized",err.response.data.message,"warning");
            history.push("/");
        }
        return Promise.reject(err);
      });
       if (loading) {
           return <div className="container">
             <center>
        <Loader
       type="Puff"
       color="#00BFFF"
       height={50}
       width={50}
       timeout={3000} //3 secs
     />
        </center>
           </div>
       }else{

         return (
            
             <Route {...rest}
                 render={({props,location})=>
                     // localStorage.getItem(logintoken.ADMINLOGINTOKEN)
                     Authenticated
                      ?
                     (<Adminlayout {...props}/>)
                     :
                   (<Redirect to={{pathname:"/",state:{from:location}}}/>)
                 }
             />
         )
       }
}

export default Adminprivateroutes
