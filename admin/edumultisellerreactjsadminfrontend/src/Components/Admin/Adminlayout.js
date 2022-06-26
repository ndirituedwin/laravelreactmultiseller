// import './Partials/assets/dist/css/adminlte.min.css'
// import './Partials/assets/dist/js/adminlte.js'
import React, { Component } from 'react'
import Adminheader from './Partials/Adminheader.js'
import Adminsidebar from './Partials/Adminsidebar.js'
import Adminfooter from './Partials/Adminfooter.js'
import { Switch,Route,Redirect } from 'react-router-dom';
import routes from '../../Routes/admin/pagesroutes/routes.js'
import axios from 'axios';
import adminauthroutes from '../../Routes/admin/Authroutes/adminauthroutes.js';
import swal from 'sweetalert';
class Adminlayout extends Component {
  state={};
  componentDidMount(){
    axios.get(adminauthroutes.admin).then(resp=>{
      this.setState({
        admin:resp.data.admin
      });
    }).catch(error=>{swal("Error",error.message,"error")});
  }
  render(){

    if(this.state.admin){
      return (


        <div className="wrapper">
        <Adminheader/>
        <Adminsidebar/>
        <Switch>
                    {
                        routes.map((route,idx)=>{
                            return(
                                route.component && (
                                <Route
                                 key={idx}
                                 path={route.path}
                                 exact={route.exact}
                                 name={route.name}
                                 render={(props)=>(<route.component {...props}/>)}

                                />
                            )
                         )
                        })}
                        <Redirect from="/admin" to="/admin/dashboard"/>
             </Switch>
        <Adminfooter/>  
        </div>
    )
  }else{
      return (
        <div className="content-wrapper" >
        <h4>You are No logged In</h4>
      </div>
      )

}
  }
}

export default Adminlayout
