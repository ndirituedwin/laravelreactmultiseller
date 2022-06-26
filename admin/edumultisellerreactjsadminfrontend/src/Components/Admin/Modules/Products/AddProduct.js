import axios from 'axios';
import React, { Fragment,useEffect,useState } from 'react'
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom'
import swal from 'sweetalert';
import productsroutes from '../../../../Routes/admin/modules/products/productsroutes';
import Loading from '../../../Partials/Loading';
function AddProduct() {

  let textonbtn="Save Product";
  const [buttonText, setbuttonText] = useState(textonbtn);
  const [loading, setloading] = useState(true);
  const [sectionswithcategories, setsectionswithcategories] = useState([])
  const [brands, setbrands] = useState([])
  const [productInput, setproductInput] = useState({
        brand_id:'',
        category_id:'',
        product_name:'',
        product_code:'',
        product_price:'',
        product_discount:'',
        product_description:'',
        productimage:'',
        product_color:'',
        product_weight:'',
        wash_care:'',
          fabric:'',
          pattern:'',
          sleeve:'',
          fit:'',
          occassion:'',
          meta_title:'',
          meta_description:'',
          meta_keywords:'',
         
  })
  const [productimage, setproductimage] = useState([])
  const [error, seterror] = useState([])
  const handleInput=(e)=>{
    e.preventDefault();
    setproductInput({...productInput,[e.target.name]:e.target.value})
  }
  const handleImage=(e)=>{
    setproductimage({productimage:e.target.files[0]})
  }
  const SaveProduct=(e)=>{
      e.preventDefault();
      const formData=new FormData();
      // alert(productimage.productimage);
      formData.append('category_id',productInput.category_id);
      formData.append('brand_id',productInput.brand_id);
      formData.append('product_name',productInput.product_name);
      formData.append('product_code',productInput.product_code);
      formData.append('product_price',productInput.product_price);
      formData.append('product_discount',productInput.product_discount);
      formData.append('product_description',productInput.product_description);
      formData.append('productimage',productimage.productimage);
      formData.append('product_color',productInput.product_color);
      formData.append('product_weight',productInput.product_weight);
      formData.append('wash_care',productInput.wash_care);
      formData.append('fabric',productInput.fabric);
      formData.append('pattern',productInput.pattern);
      formData.append('sleeve',productInput.sleeve);
      formData.append('fit',productInput.fit);
      formData.append('occassion',productInput.occassion);
      formData.append('meta_title',productInput.meta_title);
      formData.append('meta_description',productInput.meta_description);
      formData.append('meta_keywords',productInput.meta_keywords);
      axios.post(productsroutes.addproduct,formData).then(resp=>{
        switch (resp.data.status) {
          case 400:
            swal("warning",resp.data.msg,"warning");  
            break;
          case 401:
            swal("warning",resp.data.msg,"warning");
            break;  
          case 422:
            seterror(resp.data.validation_errors)
            break;  
            case 200:
              swal("success",resp.data.msg,"success");
              seterror([]);
              setproductInput({...productInput,
                brand_id:'',
                category_id:'',
                product_name:'',
                product_code:'',
                product_price:'',
                product_discount:'',
                product_description:'',
                productimage:'',
                product_color:'',
                product_weight:'',
                wash_care:'',
                  fabric:'',
                  pattern:'',
                  sleeve:'',
                  fit:'',
                  occassion:'',
                  meta_title:'',
                  meta_description:'',
                  meta_keywords:'',
              })
              break
          default:
            break;
        }
        setbuttonText(textonbtn);
      }).catch(error=>
        {
          swal("error",error.message,"error")
       setbuttonText(textonbtn)
    }
    );
  }
  /**fetch sections and brands */
  useEffect(() => {
    axios.get(productsroutes.fetchsectioncategories).then(
      resp=>{
        switch (resp.data.status) {
          case 400:
            swal("warning",resp.data.msg,"warning")
            break;
        
            case 404:
              swal("warning",resp.data.msg,"warning")
              break;   
              case 405:
                swal("warning",resp.data.msg,"warning")
                break;
          case 200:
             setsectionswithcategories(resp.data.sections);
             setbrands(resp.data.brands)
             setloading(false);
            break;  
          default:
            break;
        }
      }
    ).catch(error=>{swal("error",error.message,"error") });
  }, []);
  /** end */

  var data="";
  if(loading){
    data=<Loading/>
  }else{
    if(sectionswithcategories.length>0){
      data=sectionswithcategories.map((sec)=>{
      return  <optgroup key={sec.id} label={sec.section}>
             {(sec.categories)?
             sec.categories.map((seccat)=>(
               <option key={seccat.id} value={seccat.id}>{seccat.category_name}</option>            
               
             ))
             :''}
         
        </optgroup>
      })
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
            <li className="breadcrumb-item"><link to="/admin" />Home</li>
            <li className="breadcrumb-item active">Products</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section className="content">
    <div className="container-fluid">
      <div className="card card-default">
        <div className="card-header">
          <h3 className="card-title">Products form</h3>
        </div>
        <form  onSubmit={SaveProduct} role="form" encType="multipart/form-data">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className={(error.category_id)? 'form-group text-danger':'form-group'}>
                  <label>Select category</label>
                  <select className={(error.category_id)? 'form-control is-invalid':'form-control'}  name="category_id" onChange={handleInput} value={productInput.category_id} style={{width: '100%'}}>
                    <option value>select</option>
                    {data}
                    {/* {
                      (sectionswithcategories.length>0)?
                      sectionswithcategories.map(sec=>(
                        <optgroup key={sec.id} label={sec.section}>
                      {sec.categories.map(cat=>(
                        <option key={cat.id} value={cat.id}  style={{ backgroundColor:"yellow" }}>&nbsp;&nbsp;&nbsp;&raquo;&raquo;{cat.category_name}</option>
                       
                       )
                     
                       
                       )
                       }
                        </optgroup>
                      ))
                      :''
                    } */}
                    {/* {sectioncats.map(cat=>(
                     <optgroup key={cat.id}  >
                     <option key={cat.id} value={cat.id} style={{backgroundColor:"green"}}>&nbsp;&raquo;{cat.category_name}</option>
                       {cat.subcategories.map((sub)=>(
                         <option key={sub.id} value={sub.id}  style={{ backgroundColor:"yellow" }}>&nbsp;&nbsp;&nbsp;&raquo;&raquo;{sub.category_name}</option>
                       ))}
                     </optgroup>
                   ))} */}
                  </select>
                  <span className="text-danger">{error.category_id}</span>

                </div>
                <div className={(error.product_name)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="product_name" className="control-label">product name</label>
                  <input type="text" name="product_name" onChange={handleInput} value={productInput.product_name}  className={(error.product_name)? 'form-control is-invalid':'form-control'} placeholder="enter a product" />
                  <span className="text-danger">{error.product_name}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="div" />
                <div className={(error.brand_id)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="brand" className="control-label">brand name</label>
                  <select name="brand_id" onChange={handleInput} value={productInput.brand_id}  className={(error.brand_id)? 'form-control is-invalid':'form-control'}>
                    <option value>select</option>
                    {(brands.length>0)?
                      brands.map(brand=>(
                        <option value={brand.id} key={brand.id}>{brand.brand}</option>
                      )
                      )
                    :''}
                  </select>
                  <span className="text-danger" >{error.brand_id}</span>
                </div>
                <div className={(error.product_code)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="product_code" className="control-label">product code</label>
                  <input type="text" name="product_code"  onChange={handleInput} value={productInput.product_code} className={(error.product_code)? 'form-control is-invalid':'form-control'} placeholder="enter a product_code" />
                  <span className="text-danger" >{error.product_code}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className={(error.product_color)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="product_color" className="control-label">product color</label>
                  <input type="text" name="product_color"  onChange={handleInput} value={productInput.product_color} className={(error.product_color)? 'form-control is-invalid':'form-control'} placeholder="enter a product color" />
                  <span className="help-block text-danger">{error.product_color}</span>
                </div>

                <div className={(error.product_price)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="product_price" className="control-label">product price</label>
                  <input type="number" name="product_price"  onChange={handleInput} value={(productInput.product_price<0)? '1':productInput.product_price} className={(error.product_price)? 'form-control is-invalid':'form-control'} placeholder="enter a product_price" />
                  <span className="help-block text-danger">{error.product_price}</span>
                </div>

              </div>
              <div className="col-md-6">
                <div className={(error.product_discount)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="product_discount" className="control-label">product discount (%)</label>
                  <input type="number" name="product_discount" onChange={handleInput} value={productInput.product_discount} className={(error.product_discount)? 'form-control is-invalid':'form-control'} placeholder="enter a product discount" />
                  <span className="help-block text-danger">{error.product_discount}</span>
                </div>

                <div className={(error.product_weight)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="product_weight" className="control-label">product weight(gms)</label>
                  <input type="text" name="product_weight"  onChange={handleInput} value={productInput.product_weight}  className={(error.product_weight)? 'form-control is-invalid':'form-control'} placeholder="enter a product_weight" />
                  <span className="help-block text-danger">{error.product_weight}</span>
                </div>
              </div>
              <div className="col-md-6">
              <div className={(error.productimage)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="exampleInputFile" className="control-label">Category Image</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input type="file" name="productimage" onChange={handleImage} className={(error.productimage)? 'custom-file-input is-invalid':'custom-file-input'} id="exampleInputFile" />
                      <label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
                    </div>
                    <div className="input-group-append">
                      <span className="input-group-text" id>Upload</span>
                    </div>
                  </div>
                  <span className="help-block text-danger" >{error.productimage}</span>
                </div>  

                <div className={(error.product_description)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="product_description">Product description</label>
                  <textarea name="product_description" onChange={handleInput} value={productInput.product_description} rows={2} className={(error.product_description)? 'form-control is-invalid':'form-control'}  />
                  <span className="help-block text-danger">{error.product_description}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className={(error.wash_care)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="wash_care">Wash care</label>
                  <input type="text" name="wash_care"  onChange={handleInput} value={productInput.wash_care} className={(error.wash_care)? 'form-control is-invalid':'form-control'} placeholder="enter wash_care" />
                  <span className="help-block text-danger">{error.wash_care}</span>
                </div>

                <div className={(error.fabric)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="fabric">fabric</label>
                  <select name="fabric" onChange={handleInput} value={productInput.fabric} className={(error.fabric)? 'form-control is-invalid':'form-control'}>
                    <option value>Select</option>
                    <option value />
                  </select>
                  <span className="help-block text-danger">{error.fabric}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className={(error.sleeve)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="sleeve">Sleeve</label>
                  <select name="sleeve" onChange={handleInput} value={productInput.sleeve} className={(error.sleeve)? 'form-control is-invalid':'form-control'}>
                    <option value>Sleeve</option>
                    <option value />
                  </select>
                  <span className="help-block text-danger">{error.sleeve}</span>
                </div>

                <div className={(error.pattern)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="pattern">pattern</label>
                  <select name="pattern" onChange={handleInput} value={productInput.pattern} className={(error.pattern)? 'form-control is-invalid':'form-control'}>
                    <option value>pattern</option>
                    <option value />
                  </select>
                  <span className="help-block text-danger">{error.pattern}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className={(error.fit)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="fit">fit</label>
                  <select name="fit" onChange={handleInput} value={productInput.fit} className={(error.fit)? 'form-control is-invalid':'form-control'}>
                    <option value>fit</option>
                    <option value />
                  </select>
                  <span className="help-block text-danger">{error.fit}</span>
                </div>

                <div className={(error.occassion)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="occassion">occassion</label>
                  <select name="occassion" onChange={handleInput} value={productInput.occassion} className={(error.occassion)? 'form-control is-invalid':'form-control'}>
                    <option value>occassion</option>
                    <option value />
                  </select>
                  <span className="help-block text-danger">{error.occassion}</span>
                </div>
              </div>
              <div className="col-md-6">
                {/* <div className={(error.category_name)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="groupcode">Group code</label>
                  <input type="text" name="groupcode"  onChange={handleInput} className={(error.category_name)? 'form-control is-invalid':'form-control'} placeholder="enter groupcode" />
                  <span className="help-block text-danger">{error.fabric}</span>
                </div> */}
                <div className={(error.meta_title)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="meta_title">meta_title</label>
                  <textarea name="meta_title" onChange={handleInput} value={productInput.meta_title} rows={2} className={(error.meta_title)? 'form-control is-invalid':'form-control'}  />
                  <span className="help-block text-danger">{error.meta_title}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className={(error.meta_description)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="meta_description">meta description</label>
                  <textarea name="meta_description" onChange={handleInput} value={productInput.meta_description} rows={2} className={(error.meta_description)? 'form-control is-invalid':'form-control'}  />
                  <span className="help-block text-danger">{error.meta_description}</span>
                </div>
                <div className={(error.meta_keywords)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="meta_keywords">meta keyword</label>
                  <textarea name="meta_keywords" onChange={handleInput} value={productInput.meta_keywords} rows={2} className={(error.meta_keywords)? 'form-control is-invalid':'form-control'}  />
                  <span className="help-block text-danger">{error.meta_keywords}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" className="btn btn-primary" onClick={(e)=>setbuttonText("Saving...")}>{buttonText}</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</div>

        </Fragment>
    )
}

export default AddProduct
