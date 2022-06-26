import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

function Forgotpassword() {
    return (
        <Fragment>
 <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">Reset Password</div>
          <div className="card-body">
            <form method="POST" >
              <div className="form-group row">
                <label htmlFor="email" className="col-md-4 text-md-right ">E-Mail Address</label>
                <div className="col-md-6">
                  <input id="email" type="text" name="email"  className="form-control" onChange="" value=""   autoComplete="email" autoFocus placeholder="enter email address" />
                  {/* <span className="text-danger ">{forgotinput.error_list.email}</span> */}
                </div>
              </div>
              <div className="form-group row mb-0">
                <div className="row">
                
                <div className="col-md-6 ">
                <Link to="/" className="btn btn-primary">Go back</Link>

                </div>
                <div className="col-md-6 ">
                  <button type="submit" className="btn btn-primary">
                    Send Password Reset Link
                  </button>
                </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
        </Fragment>
    )
}

export default Forgotpassword
