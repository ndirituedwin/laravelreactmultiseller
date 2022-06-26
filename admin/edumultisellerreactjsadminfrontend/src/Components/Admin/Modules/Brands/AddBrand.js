import axios from 'axios';
import React,{Fragment,useState,useEffect} from 'react'
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import brandsroutes from '../../../../Routes/admin/modules/Brands/brandsroutes';
import sectionsroutes from '../../../../Routes/admin/modules/Sections/sectionsroutes';

function AddBrand() {
   
    const history=useHistory()
    const [brandInput, setbrandInput] = useState({
        brand:'',
        shop_id:'',
        error_list:[]
    });
    const [error, seterror] = useState([]);
    const [shops, setshops] = useState([]);
    const [loading, setloading] = useState(true);
    const [buttonText, setbuttonText] = useState("Add brand");
 
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
    const handleInput=(e)=>{
        e.persist();
        setbrandInput({...brandInput,[e.target.name]:e.target.value});
    }
 
    const saveBrand=(e)=>{
     e.preventDefault();
     const data={
         brand:brandInput.brand,
         shop_id:brandInput.shop_id
     }
  
     axios.post(brandsroutes.addbrand,data).then(resp=>{

           switch (resp.data.status) {
            case 400:
                swal("error",resp.data.msg,"error");        
                 break;
            case 401:
                setbrandInput({...brandInput,error_list:resp.data.validation_errors})        
                break;
            case 200:
                swal("success",resp.data.msg,"success");
                history.push("/admin/view/brands")
                break;    
               default:
                   break;
           }
           setbuttonText("Add Brand")

     }).catch(console.error(error=>{
         swal("error",error.message,"error")
         setbuttonText("Add Brand")
        }
        ));
 }
            var haserrorsinputred=""
            if(brandInput.error_list.brand){
                haserrorsinputred="form-control is-invalid"
            }else{
                haserrorsinputred="form-control";
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
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Brands</li>
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
                            <form  role="form"  onSubmit={saveBrand}>
                         
                            <div className="card-body">
                                <div className="row">
                                <div className="col-md-6">
                                    <div className={(brandInput.error_list.brand)? "form group text-danger":"form-group"}>
                                    <label htmlFor="categoryname" className="control-label">Brand name</label>
                                    <input type="text" name="brand" className={haserrorsinputred} onChange={handleInput} value={brandInput.brand} placeholder="enter a brand" />
                                        <span className="text-danger">{brandInput.error_list.brand}</span>    
                                    </div>       
                                </div>
                                <div className="col-md-6">
                                    <div className={(brandInput.error_list.shop_id)? "form group text-danger":"form-group"}>
                                    <label htmlFor="shop" className="control-label">Shop </label>
                                    <select name="shop_id" onChange={handleInput} value={brandInput.shop_id}  className={(brandInput.error_list.shop_id)?'form-control is-invalid':'form-control'}>
                                        <option>Select Shop</option>
                                        {shopss}
                                    </select>
                                    <span className="help-block text-danger">{brandInput.error_list.shop_id}</span>

                                    </div>       
                                </div>                              
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" onClick={()=>setbuttonText("Saving...")} className="btn btn-primary">{buttonText}</button>
                            </div>
                            </form>
                        </div>
                        
                        </div>
                    </section>
                 
                    </div>

   </Fragment>
    )
}

export default AddBrand
