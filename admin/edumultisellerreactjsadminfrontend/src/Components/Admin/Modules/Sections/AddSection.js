import axios from 'axios';
import React,{Fragment,useState,useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import sectionsroutes from '../../../../Routes/admin/modules/Sections/sectionsroutes';
function AddSection() {

  const history=useHistory();
  const [shops, setshops] = useState([])
  const [loading, setloading] = useState(true)
  const [sectionInput, setsectionInput] = useState({
    section:'',
    shop_id:'',
    error_list:[]
  });
  const [buttonText, setButtonText] = useState("Add Section"); 
  const handleInput=(e)=>{
      e.persist();
      setsectionInput({...sectionInput,[e.target.name]:e.target.value});
  }
  /**fetch shops */
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
   

  }, [])
  /** end fetch shops */
 
  const savesection=(e)=>{
     e.preventDefault();
     const data={
      section:sectionInput.section,
      shop_id:sectionInput.shop_id
     }
     axios.post(sectionsroutes.addsection,data).then(resp=>{
           switch (resp.data.status) {
             case 400:
               swal("warning",resp.data.msg,"warning");
               setButtonText("Add Section")
               break;
             case 401:
               setsectionInput({...sectionInput,error_list:resp.data.validation_errors});
               setButtonText("Add Section")
               break;  
              case 200:
                swal("success",resp.data.msg,"success");
                // setsectionInput({section:''})
                setButtonText("Add Section")
                history.push("/admin/view/sections")
              break;
             default:
              setButtonText("Add Section")
               break;
           }
     }).catch(error=>{
       swal("Warning",error.message,"warning");
       setButtonText("Add Section")
     });
     document.getElementById("CATEGORY_FORM").reset();
  }
  var shopss="";
  if(loading){
       shopss=<option >Loading...</option>
  }else{
    if(shops.length>0){

      shopss=shops.map((shop)=>{
                          return(
                            <option value={shop.id}  key={shop.id}>{shop.shop}</option>
                          )
                        })
    }else{
      shopss=<option className="text-danger" >No shops avilable</option>

    }

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
        <form onSubmit={savesection} role="form" id="CATEGORY_FORM" encType="multipart/form-data">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="section" className="control-label">section name</label>
                  <input type="text" name="section" className="form-control" onChange={handleInput}  value={sectionInput.section} placeholder="enter a section ie men / women /kids" />
                  <span className="help-block text-danger">{sectionInput.error_list.section}</span>
                </div>       
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="shop" className="control-label">Shop </label>
                  <select name="shop_id" onChange={handleInput} value={sectionInput.shop_id}  className="form-control">
                    <option>Select Shop</option>
                     {shopss}
                      <span>{sectionInput.error_list.shop_id}</span>
                  </select>

                  <span className="help-block text-danger">{sectionInput.error_list.section}</span>
                </div>       
              </div>
          
            </div>
          
          </div>
          <div className="card-footer">
            <button onClick={()=>setButtonText("Saving...")} type="submit" className="btn btn-primary">{buttonText}</button>
          </div>
        </form>
      </div>
  
    </div>
  </section>
</div>
   </Fragment>
    )
}

export default AddSection
