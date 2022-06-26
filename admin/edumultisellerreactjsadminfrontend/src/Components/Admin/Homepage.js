import React from 'react'
import Admindshboard from './Partials/Admindshboard'
import Adminheader from './Partials/Adminheader.js'
import Adminsidebar from './Partials/Adminsidebar.js'
import Adminfooter from './Partials/Adminfooter.js'
function Homepage() {
    return (
        <div>
         <Adminheader/>
         <Adminsidebar/>
         <Admindshboard/>
        <Adminfooter/>

        </div>
    )
}

export default Homepage
