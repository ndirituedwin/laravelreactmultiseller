import axios from 'axios';
import React,{Fragment,useEffect,useState} from 'react'
import swal from 'sweetalert';
import categoriesroutes from '../../../../Routes/admin/modules/Categories/categoriesroutes.js'
import Alert from '../../../Partials/Alerts/Alert.js';
import Loading from '../../../Partials/Loading.js';
import {useHistory}  from 'react-router-dom';
const EditCategory=(props)=> {

    const history=useHistory();
  const [buttonText, setButtonText] = useState("Update Category");
  const [categoryInput, setcategoryInput] = useState(
   { category_image:'',
    parent_id:'',
    section_id:'',
    category_name:'',
    category_discount:'',
    description:'',
    meta_title:'',
    meta_description:'',
    meta_keywords:''}
  )
  const [categoryimage, setcategory_image] = useState([])
  const [fourhundrederror, setfourhundrederror] = useState([])
  const [fourzerooneerror, setfourzerooneerror] = useState([])
  const [error, setError] = useState([])
  const [sectionslist, setsectionslist] = useState([])
  const [loading, setloading] = useState(true);
  const [catloading, setcatloading] = useState(true);

  const [req, setReq] = useState({
    section:"",
    category:""
});
 const [sectioncats, setsectioncats] = useState([])
  const handleInput=(e)=>{
    e.persist();
    setcategoryInput({...categoryInput,[e.target.name]:e.target.value})
  }
  const handleImage=(e)=>{
    setcategory_image({category_image:e.target.files[0]});
  }
  const selectcategories=(e)=>{
    e.persist();
    let name = e.target.name;
    let value = e.target.value;

    setcategoryInput({...categoryInput,[e.target.name]:e.target.value})
    axios.get(`http://localhost:8000/api/admin/multiseller/categories/sectioncategories/${value}`).then(resp=>{
      switch (resp.data.status) {
        case 400:
          swal("warning",resp.data.msg,"warning");
          break;
        case 200:
          setsectioncats(resp.data.categories);           
          break;  
        default:
          break;
      }
      setcatloading(false);
    }).catch(error=>{swal("warning",error.message,"warning")});
     
  }
 
  useEffect(() => {
    axios.get(categoriesroutes.fetchsections).then(resp=>{
      switch (resp.data.status) {
        case 400:
          swal("warning",resp.data.msg,"warning");
          break;
       case 404:
         swal("warning",resp.data.msg,"warning");
         break;
       case 200:
         setsectionslist(resp.data.sections);
         break;     
        default:
          break;
      }
      setloading(false);
    }).catch(error=>{swal("error",error.messae,"error")});
    /**fetch category details */
   const categoryslug=props.match.params.slug;
   axios.get(categoriesroutes.editcategory+categoryslug).then(resp=>{
    switch (resp.data.status) {
                case 400:
                    swal("error",resp.data.msg,"error")  
                    history.push("/admin/view/categories")                  
                    break;
                case 404:
                    swal("warning",resp.data.msg,"warning");
                    history.push("/admin/view/categories")                  
                    break;   
                case 200:
                    setcategoryInput(resp.data.category);                
                    break;            
                default:
                    break;
            }
            setloading(false);
}).catch(error=>{swal("error",error.message,"error")});
/**end */
  }, [props.match.params.slug])
 
/**Update Category */
    const savecategory=(e)=>{
      e.preventDefault();
      const categoryslug=props.match.params.slug;

      const formData=new FormData();
      formData.append('category_image',categoryimage.category_image)
      formData.append('parent_id',categoryInput.parent_id)
      formData.append('section_id',categoryInput.section_id)
      formData.append('category_name',categoryInput.category_name)
      formData.append('category_discount',categoryInput.category_discount)
      formData.append('description',categoryInput.description)
      formData.append('meta_title',categoryInput.meta_title)
      formData.append('meta_description',categoryInput.meta_description)
      formData.append('meta_keywords',categoryInput.meta_keywords)
      axios.post(categoriesroutes.updatecategory+categoryslug,formData).then(resp=>{
         switch (resp.data.status) {
           case 399:
              swal("error",resp.data.msg,"error")   
              history.push("/admin/view/categories")          
             break;
             case 400:
              swal("error",resp.data.msg,"error")
              history.push("/admin/view/categories")          
             break;   
          case 401:
            swal("warning",resp.data.msg,"warning")
            history.push("/admin/view/categories")          
             break;
         case 402:
            swal("warning",resp.data.msg,"warning")
            history.push("/admin/view/categories")
             break;    
         case 403:
           swal("warning",resp.data.msg,"warning")
           history.push("/admin/view/categories")          
           break;       
          case 422:
            setError(resp.data.validation_errors)
             break;
           case 200:
             swal("success",resp.data.msg,"success");   
             setError([])
              history.push("/admin/view/categories")
             break;
           default:
             break;
         }
         setButtonText("Update Category")
      }).catch(error=>{
          swal("error",error.message,"error")
          setButtonText("Update Category")

        });
    }
/**end Update Category */

  if(loading){
    return(
      <Loading/>
    )
  }
  var sectionss="";
  if(sectionslist.length===0){
    sectionss=<h4 className="text-danger">No sections found</h4>
  }else{
    sectionss=sectionslist.map((section)=>{
          return(
            <option value={section.id} key={section.id}>{section.section}</option>
          )
    });
  }
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
    var seccat="";
    var subcat="";
    if(catloading){
      seccat=<h4>Loading...</h4>
    }else{
      if(sectioncats.length===0){
        seccat=<h4 className="text-danger">No categories for the section</h4>
      }else{
        seccat=sectioncats.map((cat)=>{
          if(cat.subcategories.length===0){
            subcat=<h4 className="text-danger">No subcategories for the category</h4>
          }else{
            subcat=cat.subcategories.map((sub)=>{
              return (
                <option value={sub.id} style={{ backgroundColor:"yellow" }}>&nbsp;&nbsp;&nbsp;&raquo;&raquo;{sub.category_name}</option>
              )
            })
          }
          return (
            <option value={cat.id} key={cat.id} style={{backgroundColor:"green"}}>&nbsp;&raquo;{cat.category_name}</option>
            );
          
        }
        
        );
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
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item active">Categories</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section className="content">
    <div className="container-fluid">
      <div className="card card-default">
        <div className="card-header">
          <h3 className="card-title">Category form</h3>
        </div>
          <div className="container">
           <div className="row">
           {/* {alerterrors} */}
             {/* <Alert fourhundrederror={fourhundrederror} fourzerooneerror={fourzerooneerror}/> */}
           </div>
          </div>
        <form onSubmit={savecategory} role="form" encType="multipart/form-data">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className={(error.category_name)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="category_name" className="control-label">Category name</label>
                  <input type="text" name="category_name" className={(error.category_name)? 'form-control is-invalid':'form-control'} onChange={handleInput}   value={categoryInput.category_name} placeholder="enter a category" />
                  <span className="text-danger">{error.category_name}</span>
                </div>
                <div id="appendcategorieshere">
                <div class={(error.parent_id)? 'form-group text-danger':'form-group'}>
                <label for="parent_id" class="control-label">Select category level</label>
                <select class={(error.parent_id)? 'form-control is-invalid':'form-control'} name="parent_id" onChange={handleInput} value={categoryInput.parent_id} id="parent_id" style={{width: "100%;"}}>
                <option value="" >Select</option>
                <option value="0" style={{ backgroundColor: "blue",color:"white"}}>Main Category</option>
                  {/* <option value="" style={{backgroundColor: "red"}}></option> */}
                   {seccat}
                   {subcat}                   
                    </select>
                <span class="help-block text-danger">{error.parent_id}</span>
            </div>
                </div>          
              </div>
              <div className="col-md-6">
                <div className={(error.section_id)? 'form-group text-danger':'form-group'}>
                  <label>Select section</label>
                  <select className={(error.section_id)? 'form-control is-invalid':'form-control'} id="sectiononchange"  name="section_id" onChange={selectcategories}  value={categoryInput.section_id} style={{width: '100%'}}>
                    <option value="0" >select</option>
                    {sectionss}
                  </select>
                  <span className="help-block text-danger" >{error.section_id}</span>                
                </div>
                <div className={(error.category_image)? 'form-group text-danger':'form-group'}>
                  <label htmlFor="exampleInputFile" className="control-label">Category Image</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input type="file" name="category_image" onChange={handleImage} className={(error.category_image)? 'custom-file-input is-invalid':'custom-file-input'} id="exampleInputFile" />
                      <label className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
                    </div>
                    <div className="input-group-append">
                      <span className="input-group-text" id>Upload</span>
                    </div>
                  </div>
                  {/* <img src={`http://127.0.0.1:8000/Admin/Adminimages/${categoryInput.category_image}`} alt={categoryInput.category_name} width="50px"/> */}
                  <img src={`http://localhost:8000/Admin/Adminimages/Categoryimages/${categoryInput.category_image}`} alt={categoryInput.category_name} width="50px" />

                  <span className="help-block text-danger" >{error.category_image}</span>
                </div>     
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label htmlFor="category_discount">Category discount</label>
                  <input type="number" name="category_discount" onChange={handleInput} value={categoryInput.category_discount} id="category_discount" className="form-control"  placeholder="enter  category_discount" />
                  <span className="help-block text-danger" ></span>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Category description</label>
                  <textarea className="form-control" name="description" onChange={handleInput} value={categoryInput.description} id="description" rows="3"  />
                  <span className="help-block text-danger"></span>
                </div>
              </div>
              <div className="col-12 col-sm-6">
           
                <div className="form-group">
                  <label htmlFor="meta_title">meta title</label>
                  <textarea name="meta_title" id="meta_title" onChange={handleInput} value={categoryInput.meta_title} rows="3" className="form-control"  />
                  <span className="help-block text-danger" ></span>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label htmlFor="meta_description">meta description</label>
                  <textarea name="meta_description" onChange={handleInput} value={categoryInput.meta_description} id="meta_description" rows="3" className="form-control"  />
                  <span className="help-block text-danger" ></span>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label htmlFor="meta_keywords">meta keywords</label>
                  <textarea name="meta_keywords" onChange={handleInput} value={categoryInput.meta_keywords} id="meta_keywords" rows="3" className="form-control"  />
                  <span className="help-block text-danger" ></span>
                </div>
              </div>          
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" onClick={()=>setButtonText("Saving...")} className="btn btn-primary">{buttonText}</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</div>
   </Fragment>


    )
}

export default EditCategory
