import React,{useState,useEffect,Fragment} from 'react'
import { useHistory,Link } from 'react-router-dom';
import sectionsroutes from '../../../../Routes/admin/modules/Sections/sectionsroutes';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import FetchShops from './FetchShops';
function EditSection(props) {
    
   const history=useHistory();
   const [buttonText, setButtonText] = useState("Update Section");
   const [sectionInput, setsection] = useState([]);
   const [loading, setloading] = useState(true);
   const [shops, setshops] = useState([]);
   const [error, setError] = useState([]);
   const handleInput=(e)=>{
       e.persist();
       setsection({...sectionInput,[e.target.name]:e.target.value})
   }
   /**fetch section data */
   const sectionslug=props.match.params.slug;
   useEffect(() => {
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
       axios.get(sectionsroutes.editsection+sectionslug).then(resp=>{
           switch (resp.data.status) {
               case 400:
                   swal("error",resp.data.msg,"error")
                   history.push("/admin/view/sections")
                   break;
                case 404:
                    swal("warning",resp.data.msg,"warning");
                    history.push("/admin/view/sections")
                    break;
                  case 200:
                      setsection(resp.data.section);
                      break;   
               default:
                history.push("/admin/view/sections")
                   break;
           }
               setloading(false);
       }).catch(error=>{swal("error",error.message,"error")});
       
   }, [props.match.params.slug]);
   /**end Of fetch Section */
   /** Update The section */
   const updatesection=(e)=>{
       e.preventDefault();
       const sectionnsug=props.match.params.slug;
       const data=sectionInput;
       axios.put(sectionsroutes.updatesection+sectionnsug,data).then(resp=>{
           switch (resp.data.status) {
               case 400:
                   swal("error",resp.data.msg,"error");
                   setButtonText("Update Section")
                   break;
               case 401:
                     setError(resp.data.validation_errors)
                     setButtonText("Update Section")
                   break;    
                case 404:
                    swal("warning",resp.data.msg,"error");
                    setButtonText("Update Section")
                    break; 
                case 202:
                swal("warning",resp.data.msg,"error");
                setButtonText("Update Section")
                break;
                case 200:
                    swal("success",resp.data.msg,"success");
                    setButtonText("Update Section")
                    setError([]);
                    history.push("/admin/view/sections")
                    break;              
               default:
                setButtonText("Update Section")
                   break;
           }
       }).catch(error=>{
           swal("error",error.message,"error");
           setButtonText("Update Section")
       });

   }
   /**end Of section Update */
 
   var shopss="";
   if(loading){
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
   }else{
        if(shops.length>0){

      shopss=shops.map((shop)=>{
                          return(
                            <option value={shop.id}  key={shop.id} >{shop.shop}</option>
                          )
                        })
      }else{
      shopss=<option className="text-danger" >No shops avilable</option>
      } 
      return (
        <Fragment>
<div className="content-wrapper">
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1>Catalogues</h1>
        </div>
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><Link to="/admin">Home</Link></li>
            <li className="breadcrumb-item active">Sections</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section className="content">
    <div className="container-fluid">
      <div className="card card-default">
        <div className="card-header">
          <h3 className="card-title">Sections form</h3>
          <div className="card-tools">
            <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-remove" /></button>
          </div>
        </div>
        <form  role="form" onSubmit={updatesection}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="section" className="control-label">section name</label>
                  <input type="text" name="section" className="form-control" onChange={handleInput}  value={sectionInput.section} placeholder="enter a section ie men / women /kids" />
                  <span className="help-block text-danger">{error.section}</span>
                </div>       
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="shop" className="control-label">Shop </label>
                  <select name="shop_id" onChange={handleInput} value={sectionInput.shop_id}  className="form-control">
                    <option>Select Shop</option>
                     {shopss}
                  <span className="help-block text-danger">{error.shop_id}</span>
                  </select>

                </div>       
              </div>
          
            </div>
          
          </div>
          <div className="card-footer">
            <button onClick={()=>setButtonText("Updating...")} type="submit" className="btn btn-primary">{buttonText}</button>
          </div>
        </form>
      </div>
  
    </div>
  </section>
</div>

   </Fragment>
    )
}
}
export default EditSection
