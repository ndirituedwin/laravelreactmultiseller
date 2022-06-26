import axios from 'axios';
import React,{useEffect,useState} from 'react'
import { Link,useHistory} from 'react-router-dom';
import swal from 'sweetalert';
import productsroutes from '../../../../Routes/admin/modules/products/productsroutes';
import Loading from '../../../Partials/Loading';
import SweetAlert from 'react-bootstrap-sweetalert';
const ProductAttributes=(props)=> {

  const [newprice, setnewprice] = useState([])
  const [newstock, setnewstock] = useState([])
    const history=useHistory();
   const [productInput, setproductInput] = useState({
       product_name:'',
       product_color:'',
       product_code:'',
       productimage:'',
       size:'',
       sku:'',
       price:'',
       stock:''
   })
   
  let textonbtn="Submit attribute";
  const [buttonText, setbuttonText] = useState(textonbtn);
  const [loading, setloading] = useState(true);
  const [product, setproduct] = useState([])
  const [error, setError] = useState([])
  const handleInput=(e)=>{
    e.preventDefault();
    setproductInput({...productInput,[e.target.name]:e.target.value})
  }
 
    useEffect(() => {
         //feth product
    const productlug=props.match.params.slug;
    axios.get(productsroutes.getaddproductattr+productlug).then(resp=>{
        switch (resp.data.status) {
            case 400:
                swal("warning",resp.data.msg,"warning")
                history.push("/admin/view/products");
                break; 
            case 404:
                swal("warning",resp.data.msg,"warning")
                history.push("/admin/view/products");
                break;
            case 200:
              setproductInput(resp.data.product)    
              setproduct(resp.data.product)  
             break;
            default:
             break;
        }
        setloading(false);
    }).catch(error=>{
        swal("error",error.message,"error");
        }); 
    }, [props.match.params.slug]);
    const Saveproattribute=(e)=>{
        e.preventDefault();
        const productslug=props.match.params.slug;
        const data={
            size:productInput.size,
            sku:productInput.sku,
            price:productInput.price,
            stock:productInput.stock
        }
        axios.post(productsroutes.saveproattribute+productslug,data).then(resp=>{
            switch (resp.data.status) {
                case 400:
                    swal("warning",resp.data.msg,"warning");
                    break;
                    case 422:
                    setError(resp.data.validation_errors)
                    break;
                    case 404:
                    swal("warning",resp.data.msg,"warning");
                    break;
                    case 401:
                    swal("warning",resp.data.msg,"warning");
                    break;
                    case 402:
                    swal("warning",resp.data.msg,"warning");
                    break;
                    case 200:
                      swal("succes",resp.data.msg,"success");
                        setError([])
                    swal("success",resp.data.msg,"success");

                          //  fetch product attributes
                           const productlug=props.match.params.slug;
                           axios.get(productsroutes.getaddproductattr+productlug).then(resp=>{
                               switch (resp.data.status) {
                                   case 400:
                                       swal("warning",resp.data.msg,"warning")
                                       history.push("/admin/view/products");
                                       break; 
                                   case 404:
                                       swal("warning",resp.data.msg,"warning")
                                       history.push("/admin/view/products");
                                       break;
                                   case 200:
                                    //  setproductInput(resp.data.product)    
                                     setproduct(resp.data.product)  
                                    break;
                                   default:
                                    break;
                               }
                               setloading(false);
                           }).catch(error=>{
                               swal("error",error.message,"error");
                               }); 

                    break;
                default:
                    break;
            }
            setbuttonText(textonbtn)
        }).catch(error=>{swal("warning",error.message,"error")
      setbuttonText(textonbtn);
      })
    }
     const updatestatus=(e,slug)=>{
       e.preventDefault();
       const thisclicked=e.currentTarget;
       axios.put(productsroutes.updateproductattributestatus+slug).then(resp=>{
        switch (resp.data.status) {
          case 400:
            swal("error",resp.data.msg,"error");
            break;
          case 404:
            swal("warning",resp.data.msg,"warning");
              break;
          case 200:
            swal("success",resp.data.msg,"success")    
            if(resp.data.newdata===0){
              thisclicked.innerText="In Active";
            }else if(resp.data.newdata===1){
             thisclicked.innerText="Active";
            }
            break    
          default:
            break;
        }
      }).catch(error=>{
        swal("error",error.message,"error")
        thisclicked.innerText="In active"
      });

     }
     const deleteproduct=(e,slug)=>{
       e.preventDefault();
     if (window.confirm('Are you sure you wish to delete this item?')){
      
       const thisclicked=e.currentTarget;
       thisclicked.innerText="Destroying...";
       axios.delete(productsroutes.deleteproductattribute+slug).then(resp=>{
               switch (resp.data.status) {
                 case 400:
                   swal("error",resp.data.msg,"error")
                   break;
                 case 404:
                   swal("warning",resp.data.msg,"warning")
                   break;
                 case 200:
                   swal("success",resp.data.msg,"success")
                   thisclicked.closest("tr").remove()
                   // history.push("/admin/view/brands")
                   break;
                 default:
                   break;
               }
               thisclicked.innerText="Destroy";
             }).catch(error=>{swal("error",error.message,"error")
       thisclicked.innerText="";
 
     });
    }
     }
     
     //decremenet price
     const handleDecrement=(e,id)=>{
       e.preventDefault()
          
             axios.post(productsroutes.decrementprice+id).then(resp=>{
               switch (resp.data.status) {
                 case 400:
                   swal("warning",resp.data.msg,"warning")
                   break;
                 case 404:
                   swal("warning",resp.data.msg,"warning");
                    break;   
                case 200:
                  // swal("success",resp.data.msg,"success");
                  setnewprice(resp.data.newprice)
                  break;
                 default:
                   break;
               }
             }).catch(error=>{
               swal("warning",error.message,"warning")
              });
     }
     
     //Incremenet price
     const handleIncrement=(e,id)=>{
       e.preventDefault()
       axios.post(productsroutes.incrementprice+id).then(resp=>{
        switch (resp.data.status) {
          case 400:
            swal("warning",resp.data.msg,"warning")
            break;
          case 404:
            swal("warning",resp.data.msg,"warning");
             break;   
         case 200:
           // swal("success",resp.data.msg,"success");
           setnewprice(resp.data.newprice)
           break;
          default:
            break;
        }
      }).catch(error=>{
        swal("warning",error.message,"warning")
       });
                
    }
     //Incremenet price
     const handlestockDecrement=(e,id)=>{
      e.preventDefault()
      axios.post(productsroutes.decrementstock+id).then(resp=>{
       switch (resp.data.status) {
         case 400:
           swal("warning",resp.data.msg,"warning")
           break;
         case 404:
           swal("warning",resp.data.msg,"warning");
            break;   
        case 200:
          // swal("success",resp.data.msg,"success");
          setnewstock(resp.data.newstock)
          break;
         default:
           break;
       }
     }).catch(error=>{
       swal("warning",error.message,"warning")
      });
               
   }
    //Incremenet price
    const handlestockIncrement=(e,id)=>{
      e.preventDefault()
      axios.post(productsroutes.incrementstock+id).then(resp=>{
       switch (resp.data.status) {
         case 400:
           swal("warning",resp.data.msg,"warning")
           break;
         case 404:
           swal("warning",resp.data.msg,"warning");
            break;   
        case 200:
          // swal("success",resp.data.msg,"success");
          setnewstock(resp.data.newstock)
          break;
         default:
           break;
       }
     }).catch(error=>{
       swal("warning",error.message,"warning")
      });
               
   }
    var data="";
    if(loading){
        return <Loading/>
    }
    if(product.productattributes.length>0){
       data=product.productattributes.map((proattr)=>{
         return(<tr key={proattr.id}>
         <td>{product.product_name}</td>
         <td>{proattr.size}</td>
         <td>{proattr.sku}</td>
         <td width="15%">
         <div className="input-group">
                        <button typ="button" onClick={(e)=>handleDecrement(e,proattr.id)} className="input-group-text">-</button>
                                  <input type="text"  className="form-control"  name="price"  value={(newprice.id===proattr.id)?newprice.price:proattr.price} required/>
                         <button type="button" onClick={(e)=>handleIncrement(e,proattr.id)} className="input-group-text">+</button>
                    </div>
         </td>
         <td width="15%">
         <div className="input-group">
                        <button type="button" onClick={(e)=>handlestockDecrement(e,proattr.id)} className="input-group-text">-</button>
                                  <input type="text" className="form-control" name="stock" value={(proattr.id===newstock.id)?newstock.stock:proattr.stock} required/>

                         <button type="button" onClick={(e)=>handlestockIncrement(e,proattr.id)} className="input-group-text">+</button>
                    </div>
         </td>
         <td>          
                      <Link style={{textDecoration:"none"}} onClick={(e)=>updatestatus(e,proattr.id)}  href="javascript:void(0)" >{(proattr.is_enabled==0 ? 'In Active':'Active')}</Link>
                    </td>
                    <td>
  
                    <Link to="javasscript:void(0)" onClick={(e)=>deleteproduct(e,proattr.id)} className="fas fa-trash confirmdelete" title="trash product"></Link>
                      </td> 

         </tr>
         )

       })
    }else{
      data=
      <h4 className="text-danger text-center">Product attributes not found</h4>
    }
    return (
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
            <li className="breadcrumb-item active">Product attributes</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section className="content">
    <div className="container-fluid">
      <form onSubmit={Saveproattribute} encType="multipart/form-data">
        <div className="card card-default">
          <div className="card-header">
            <h3 className="card-title">Product attributes form</h3>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse"><i className="fas fa-minus" /></button>
              <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-remove" /></button>
            </div>
          </div>          
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="product_name" className="control-label">product name</label>
                  <input type="text"  name="product_name" onChange={handleInput} value={productInput.product_name} className="form-control" placeholder="enter a product"  />
                </div>
                <div className="form-group">
                  <label htmlFor="product_code" className="control-label">product code</label>
                  <input type="text" name="product_code"  onChange={handleInput} value={productInput.product_code} className="form-control" placeholder="enter a product_code" />
                </div>   
              </div>
              <div className="col-md-6">
                <div className="form-group" >
                  <label htmlFor="product_color" className="control-label">product color</label>
                  <input type="text" name="product_color" onChange={handleInput} value={productInput.product_color} className="form-control" placeholder="enter a product color" />
                </div>

               

               
              <div className="form-group">
                  <label htmlFor="exampleInputFile" className="control-label">Product Image</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input type="file" name="productimage" className="custom-file-input" id="exampleInputFile" />
                      <label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
                    </div>
                    <div className="input-group-append">
                      <span className="input-group-text" id>Upload</span>
                    </div>
                  </div>
                  <img src={`http://localhost:8000/Admin/Adminimages/ProductImages/medium/${productInput.product_image}`} alt={productInput.category_name} width="50px" />
                </div>  
              </div>
          
              <div className="col-md-8">
                <div className="form-group">
                <label htmlFor="">Fill the product attribute Properties</label>
                <div className="row">
                    <div className="col-md-3">
                    <input type="text"  name="size"  className={(error.size)? 'form-control is-invalid':'form-control'} onChange={handleInput} value={setproductInput.size} placeholder="size" />
                    <span className="text-danger">{error.size}</span>
                    </div>
                    <div className="col-md-3">
                    <input type="text"  name="sku"  className={(error.sku)? 'form-control is-invalid':'form-control'} onChange={handleInput}  value={setproductInput.sku} placeholder="sku" />
                    <span className="text-danger">{error.sku}</span>
                    </div>
                    <div className="col-md-3">
                    <input type="number"  name="price"  className={(error.price)? 'form-control is-invalid':'form-control'}  onChange={handleInput} value={setproductInput.price} placeholder="price" />
                    <span className="text-danger">{error.price}</span>
                    </div>
                    <div className="col-md-3">
                    <input type="number"   name="stock" className={(error.stock)? 'form-control is-invalid':'form-control'} onChange={handleInput} value={setproductInput.stock} placeholder="stock" />
                    <span className="text-danger">{error.stock}</span>
                    </div>
                </div>
                </div>
              </div>            
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" onClick={(e)=>setbuttonText("Saving...")} className="btn btn-primary">{buttonText}</button>
          </div>
        </div>
      </form>
      <form name="editattributeform" method="POST" role="form">
        <div className="card">
      
          <div className="card-header">
            <h3 className="card-title">Products attributes</h3>
          </div>
          <div className="card-body">
            <table id="attributes" className="table table-bordered table-hover">
           
              <thead>
                <tr>
                  <th>product name </th>
                  <th>Size </th>
                  <th>Sku </th>
                  <th>Price </th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                        {data}
              </tbody>
            </table>
          </div>
          <div className="card-footer">
            <button type="submit" className="btn btn-primary">Update attributes</button>
          </div>
        </div>
      </form>
    </div>
  </section>
</div>

    )
}

export default ProductAttributes
