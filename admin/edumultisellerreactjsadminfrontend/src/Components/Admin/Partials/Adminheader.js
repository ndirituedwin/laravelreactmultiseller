import axios from 'axios';
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert';
import adminauthroutes from '../../../Routes/admin/Authroutes/adminauthroutes';
class Adminheader extends Component{ 
  state={};
  componentDidMount(){
    axios.get(adminauthroutes.admin).then(resp=>{
      this.setState({
        admin:resp.data.admin
      });
      // console.log(this.state.name);
    }).catch(error=>{swal("Error",error.message,"error")});
  }
  handlelogout=()=>{
  axios.post(adminauthroutes.logout).then(resp=>{
        switch (resp.data.status) {
                    case 400:
                        swal("Error",resp.data.msg,"error");
                        break;                 
                    case 200:
                        localStorage.clear();
                        swal("success",resp.data.msg,"success");
                        break;    
                     default:
                         break;
                 }
      }).catch(err=>{swal("Error",err.message,"error")});
          
  }

 
  render(){
    var logoutbtn=""
    var admname=""
    if(this.state.admin){
      logoutbtn=(
        <div>
          <Link to={'/'} onClick={this.handlelogout} className="nav-link">Logout</Link>
        </div>
      )
      admname=(this.state.admin.name)
    }else{
      return( <h4>You are not logged in</h4>)
    }

    return (
        <div>
            
 
            {/* <!-- Navbar --> */}
  <nav className="main-header navbar navbar-expand navbar-white navbar-light">
    {/* <!-- Left navbar links --> */}
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link" data-widget="pushmenu" to="#" role="button"><i className="fas fa-bars"></i></Link>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <Link to="/admin" className="nav-link">Home</Link>
      </li>
    </ul>

    {/* <!-- Right navbar links --> */}
    <ul className="navbar-nav ml-auto">
      {/* <!-- Navbar Search --> */}
      <li className="nav-item">
        <Link className="nav-link" data-widget="navbar-search" to="#" role="button">
          <i className="fas fa-search"></i>
        </Link>
        <div className="navbar-search-block">
          <form className="form-inline">
            <div className="input-group input-group-sm">
              <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search"/>
              <div className="input-group-append">
                <button className="btn btn-navbar" type="submit">
                  <i className="fas fa-search"></i>
                </button>
                <button className="btn btn-navbar" type="button" data-widget="navbar-search">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </li>
      <li className="nav-item">
        <Link className="nav-link" data-widget="navbar-search" to="#" role="button">
          <i className="">{admname}</i>
        </Link>
       
      </li>

      {/* <!-- Messages Dropdown Menu --> */}
          <div>{logoutbtn}</div>
       
      {/* <!-- Notifications Dropdown Menu --> */}
      <li className="nav-item dropdown">
        <Link className="nav-link" data-toggle="dropdown" to="#">
          <i className="far fa-bell"></i>
          <span className="badge badge-warning navbar-badge">15</span>
        </Link>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <span className="dropdown-item dropdown-header">15 Notifications</span>
          <div className="dropdown-divider"></div>
          <Link to="#" className="dropdown-item">
            <i className="fas fa-envelope mr-2"></i> 4 new messages
            <span className="float-right text-muted text-sm">3 mins</span>
          </Link>         
          <div className="dropdown-divider"></div>
          <Link to="#" className="dropdown-item dropdown-footer">See All Notifications</Link>
        </div>
      </li>
      <li className="nav-item">
        <Link className="nav-link" data-widget="fullscreen" to="#" role="button">
          <i className="fas fa-expand-arrows-alt"></i>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" data-widget="control-sidebar" data-slide="true" to="#" role="button">
          <i className="fas fa-th-large"></i>
        </Link>
      </li>
    </ul>
  </nav>
  {/* <!-- /.navbar --> */}
        </div>
    )
}
}
export default Adminheader
