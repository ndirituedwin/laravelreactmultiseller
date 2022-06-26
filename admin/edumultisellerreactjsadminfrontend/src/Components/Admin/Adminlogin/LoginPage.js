import React, { Fragment,useState } from 'react'
import axios from 'axios'
import { Link,useHistory } from 'react-router-dom'
import './Styles/css/style.css'
import './Styles/fonts/material-icon/css/material-design-iconic-font.min.css'
import image from './Styles/images/signin-image.jpg'
import adminauthroutes from '../../../Routes/admin/Authroutes/adminauthroutes'
import swal from 'sweetalert'
import logintoken from '../../../Tokens/Admin/logintoken'
const LoginPage=(props)=> {
   
    const history=useHistory();
    const [loadingg, setloadingg] = useState(false)
    const [buttonText, setButtonText] = useState("Login"); 
    const [logininput, setlogininput] = useState({
        email:'',
        password:'',
        error_list:[]
    })
    const setloading=()=>{
        // e.preventDefault();
        setloadingg(true);
        setButtonText("Please wait...")
         
    }
    const [IsLoggedIn, setIsLoggedIn] = useState(false)
        const handleInput=(e)=>{
        e.persist();
        setlogininput({...logininput,[e.target.name]:e.target.value});
    }
    const Signinuser=(e)=>{
        e.preventDefault();
         const data={
             email:logininput.email,
             password:logininput.password
         }
         
         axios.post(adminauthroutes.login,data).then(resp=>{
                 switch (resp.data.status) {
                    case 400:
                        swal("Error",resp.data.msg,"error");
                        setButtonText("Login")
                        setloadingg(false)

                        break;
                    case 401:
                        setlogininput({...logininput,error_list:resp.data.validation_errors});    
                        setButtonText("Login")
                        setloadingg(false)
                        break;
                    case 205:
                        swal("Warning",resp.data.msg,"warning");
                        setButtonText("Login")
                        setloadingg(false)

                        break;
                    case 200:
                        localStorage.setItem(logintoken.ADMINLOGINTOKEN,resp.data.token.token);
                        localStorage.setItem(logintoken.ADMINLOGINNAME,resp.data.token.admin.email);
                        setButtonText("Login")
                        // history.push("/admin");
                        swal("success",resp.data.msg,"success");
                        setIsLoggedIn(true)
                        break;    
                     default:
                        setButtonText("Login")
                        setloadingg(false)

                         break;
                 }
         }).catch(err=>{
             swal("error",err.message,"error");
             setButtonText("Login")
             setloadingg(false)

             


         });
    }
    if(IsLoggedIn){
        //  <Redirect to="/admin"/>
        history.push("/admin")
        // <Redirect to="/admin"/>
    }
  let dataa="";
    if(loadingg){
        dataa=<i class='fa fa-refresh fa-spinner'></i>
    }
    return (
        <Fragment>
         {/* <!-- Sing in  Form --> */}
        <section className="sign-in">
            <div className="container">
                <div className="signin-content">
                    <div className="signin-image">
                        <figure><img src={image} alt="sing up image"/></figure>
                    </div>

                    <div className="signin-form">
                        <h6 className="form-title">Sign In</h6>
                        <form onSubmit={Signinuser} className="register-form" id="login-form">
                            <div className="form-group">
                                <label htmlFor="email"><i className="zmdi zmdi-account material-icons-name labell"></i></label>
                                <input type="text" name="email" onChange={handleInput} value={logininput.email}  id="email" placeholder="Your Name"/>
                                      <span className="text-danger">{logininput.error_list.email}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><i className="zmdi zmdi-lock labell"></i></label>
                                <input type="password" name="password" onChange={handleInput} value={logininput.password} id="password" placeholder="Password"/>
                                <span className="text-danger">{logininput.error_list.password}</span>

                            </div>
                            <div className="form-group">
                                <input type="checkbox" name="remember-me" id="remember-me" className="agree-term" />
                                <label htmlFor="remember-me" className="label-agree-term"><span><span></span></span>Remember me</label>
                            </div>
                            <div className="form-group form-button">
                            {/* <input type="submit"  onClick={()=>setButtonText("Please wait..."),setloading()}  name="signin" id="signin"  value={buttonText}/> */}
                            <button type="submit"  onClick={()=>setloading()} className="form-control"  name="signin" id="signin" style={{ width:"200px" }}  disabled={loadingg} >{buttonText} <i className="fa fa-refresh fa-spinner-grow"></i></button>
                                {/* className="form-submit" */}
                            </div>
                            <div className="form-group form-button">
                            <Link to={'/forgot'} className="text-right">Forgot password ?</Link>
                                {/* className="form-submit" */}
                            </div>
                        </form>
                        <div className="social-login">
                            <span className="social-label">Or login with</span>
                            <ul className="socials">
                                <li><Link to="#"><i className="display-flex-center zmdi zmdi-facebook"></i></Link></li>
                                <li><Link to="#"><i className="display-flex-center zmdi zmdi-twitter"></i></Link></li>
                                <li><Link to="#"><i className="display-flex-center zmdi zmdi-google"></i></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        </Fragment>
    )
}

export default LoginPage
