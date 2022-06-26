import React, { Fragment } from 'react'

const Alert=(fourhundrederror,fourzerooneerror)=> {
    var alerterrors="";
    if(fourhundrederror){
       alerterrors= <div class="alert alert-danger alert-dismissible fade show" role="alert">{fourhundrederror}
       <button type="button" class="close" data-dismiss="alert" aria-label="close"><span aria-hidden="true">&times;</span></button>
        </div>
    }else if(fourzerooneerror){
        alerterrors= <div class="alert alert-danger alert-dismissible fade show" role="alert">{fourhundrederror}
        <button type="button" class="close" data-dismiss="alert" aria-label="close"><span aria-hidden="true">&times;</span></button>
         </div>
    }else{
        
    }
    return (
        <Fragment>
             {alerterrors} 
        </Fragment>
    )
}

export default Alert
