import axios from 'axios';
import React,{useEffect,useState} from 'react'
import { useHistory} from 'react-router-dom'
import swal from 'sweetalert';
import adminauthroutes from '../../Routes/admin/Authroutes/adminauthroutes';
import { Loading } from 'react-loading-dot/lib';
function Profile() {
const history=useHistory();
const [Authenticated, setAuthenticated] = useState(false);
 const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get(adminauthroutes.admin).then(resp=>{
            switch (resp.data.status) {
            case 400:
                swal("Error",resp.data.msg,"error"); 
                break;
            case 200:
                setAuthenticated(true);
                break;     
            default:
                break;
        }
        setLoading(false);
        }).catch(error=>{
            swal("Error",error.message,"error");
         });
        return () => {
            setAuthenticated(false);
        }
    }, [])
    if(loading){
        return <div className="container"><h6><Loading/></h6></div>
    }
   if(Authenticated){
       return (
         <div className="content-wrapper">
               <h1>Admin Profile</h1>
           </div>
       )
   }else{
       history.push("/");
    //    <Redirect to="/"/>
   }

    
}
export default Profile
