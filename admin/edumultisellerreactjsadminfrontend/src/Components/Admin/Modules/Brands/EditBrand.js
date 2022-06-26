import axios from 'axios';
import React,{useEffect,useState,Fragment} from 'react'
import { Link,useHistory  } from 'react-router-dom'
import swal from 'sweetalert';
import brandsroutes from '../../../../Routes/admin/modules/Brands/brandsroutes';
import sectionsroutes from '../../../../Routes/admin/modules/Sections/sectionsroutes';
import Loading from '../../../Partials/Loading';

const EditBrand=(props)=>{
    const history=useHistory()
    const [brandInput, setbrandInput] = useState([])
    const [buttonText, setbuttonText] = useState("Update Brand")
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState([]);
    const [shops, setshops] = useState([]);

    const handleInput=(e)=>{
        e.persist();
        setbrandInput({...brandInput,[e.target.name]:e.target.value});
    }

    const slug=props.match.params.slug;
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
        axios.get(brandsroutes.editbrand+slug).then(resp=>{
            switch (resp.data.status) {
                case 400:
                    swal("error",resp.data.msg,"error")  
                    history.push("/admin/view/brands")                  
                    break;
                case 404:
                    swal("warning",resp.data.msg,"warning");
                    history.push("/admin/view/brands")                  
                    break;   
                case 200:
                    setbrandInput(resp.data.brand);                
                    break;            
                default:
                    break;
            }
            setloading(false);
        }).catch(error=>{swal("error",error.message,"error")});
        
        return () => {
            
        }
    }, [props.match.params.slug])
    /**Update section */
    const updatebrand=(e)=>{
        e.preventDefault();
        const brandslug=props.match.params.slug;
        const data=brandInput;
    axios.put(brandsroutes.updatebrand+brandslug,data).then(resp=>{
        switch (resp.data.status) {
            case 400:
                swal("error",resp.data.msg,"error");
                break;
            case 401:
                seterror(resp.data.validation_errors)    
                break;
            case 404:
                swal("warning",resp.data.msg,"warning")
                history.push("admin/view/brands")
                break;  
            case 202:
                swal("warning",resp.data.msg,"warning")
                break;
            case 200:
                swal("success",resp.data.msg,"success")
                seterror([])
                history.push("/admin/view/brands")
                break;          
                default:
                    break;
                }
                setbuttonText("Update Brand")
    }).catch(error=>{
        swal("error",error.message,"error")
        setbuttonText("Update Brand")
    });
    }
    if(loading){
        return(
            <Loading/>
        )
    }
    var shopss="";
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
          <h3 className="card-title">Brands form</h3>
          <div className="card-tools">
            <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-remove" /></button>
          </div>
        </div>
        <form  role="form" onSubmit={updatebrand}>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
              <div className={(error.brand)? "form group text-danger":"form-group"}>
                  <label htmlFor="brand" className="control-label">brand name</label>
                  <input type="text" name="brand" className={(error.brand)? "form-control is-invalid ":"form-control"} onChange={handleInput} value={brandInput.brand} placeholder="enter a brand ie men / women /kids" />
                  <span className="help-block text-danger">{(error.brand)? error.brand :""}</span>
                </div>  
                       
              </div>
              <div className="col-md-6">
                <div className={(error.shop_id)? "form group text-danger":"form-group"}>
                  <label htmlFor="shop" className="control-label">Shop </label>
                  <select name="shop_id" onChange={handleInput} value={brandInput.shop_id}  className={(error.shop_id)?'form-control is-invalid':'form-control'}>
                    <option>Select Shop</option>
                     {shopss}
                  </select>
                  <span className="help-block text-danger">{error.shop_id}</span>

                </div>       
              </div>
          
            </div>
          
          </div>
          <div className="card-footer">
            <button  type="submit" onClick={()=>setbuttonText("Updating...")} className="btn btn-primary">{buttonText}</button>
          </div>
        </form>
      </div>
  
    </div>
  </section>
</div>
   </Fragment>
    )
}

export default EditBrand
