import React from 'react'
import Loader from 'react-loader-spinner';

function Loading() {
    return (
        <div className="content-wrapper mt-5" >
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
       );
}

export default Loading
