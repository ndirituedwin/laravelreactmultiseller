import react from 'react';
import "./Components/FontAwesomeIcons"
import {BrowserRouter as Router, Switch,Route } from 'react-router-dom';
// import "./components/FontawsomeIcons";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import LoginPage from './Components/Admin/Adminlogin/LoginPage';
import Forgotpassword from './Components/Admin/Adminlogin/Forgotpassword';
import Adminprivateroutes from './Routes/admin/pagesroutes/Adminprivateroutes.js'

function App() {
  return (
  <Router>
    <div className="App">
      <Switch>
      <Route exact path="/" name="Login" component={LoginPage}/>
      <Route exact path="/forgot" name="Login" component={Forgotpassword}/>
      {/* <Route  path="/admin" name="Admin" render={(props)=><Adminlayout {...props}/>}/> */}
      <Adminprivateroutes  path="/admin" name="Admin" />
      </Switch>
    </div>
    </Router>
  );
}

export default App;
