import React,{useState} from 'react'
import axios from 'axios';
import swal from 'sweetalert';
import sectionsroutes from '../../../../Routes/admin/modules/Sections/sectionsroutes';
const FetchShops=()=> {
    const [loading, setloading] = useState(true);
    const [shops, setshops] = useState([]);
    axios.get(sectionsroutes.fetchshops).then(resp=>{
        switch (resp.data.status) {
          case 400:
            swal("error",resp.data.msg,"error");
            break;
          case 404:
            console.log(resp.data.msg);  
             break;
          case 200:
            setshops(resp.data.shops);
            break;
          default:
            break;
        }
        setloading(false);
      }).catch(error=>{swal("errpr",error.message,"error")})
}

export default FetchShops
