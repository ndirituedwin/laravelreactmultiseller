import React from 'react';
import {Link} from 'react-router-dom'
// import '../Adminlogin/Styles/css/style.css'
// import '../Adminlogin/Styles/fonts/material-icon/css/material-design-iconic-font.min.css'
function Adminsidebar() {
    return (
        <div>
 {/* Main Sidebar Container */}
 <aside className="main-sidebar sidebar-dark-primary elevation-4">
  {/* Brand Logo */}
  <Link to="index3.html" className="brand-link">
    <img src="/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
    <span className="brand-text font-weight-light">AdminLTE 3</span>
  </Link>
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="image">
        <img src="/dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
      </div>
      <div className="info">
        <Link to="#" className="d-block">Alexander Pierce</Link>
      </div>
    </div>
    {/* SidebarSearch Form */}
    <Link to="/admin" className="d-block text-center bg-blue nav-link">Dashboard</Link>

    {/* <div className="form-inline">
      <div className="input-group" data-widget="sidebar-search">

        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
        <div className="input-group-append">
          <button className="btn btn-sidebar">
            <i className="fas fa-search fa-fw" />
          </button>
        </div>
      </div>
    </div> */}
    {/* Sidebar Menu */}
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
        <li className="nav-item menu-open">
          <Link to="#" className="nav-link ">
            <i class="nav-icon fas fa-tachometer-alt" />
            <p>
              Dashboard
              <i className="right fas fa-angle-left" />
            </p>
          </Link>
          <ul className="nav nav-treeview">
            <li className="nav-item">
              <Link to="/admin/view/sections" className="nav-link ">
                <i className="far fa-circle nav-icon" />
                <p>Sections</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/view/brands" className="nav-link ">
                <i className="far fa-circle nav-icon" />
                <p>Brands</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/view/categories" className="nav-link ">
                <i className="far fa-circle nav-icon" />
                <p>Categories</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/view/products" className="nav-link" >
                <i className="far fa-circle nav-icon" />
                <p>Products</p>
              </Link>
            </li>
           
            
          </ul>
        </li>
      </ul>
    </nav>
    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

        </div>
    )
}

export default Adminsidebar
