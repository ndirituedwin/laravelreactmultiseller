import React,{Fragment,useEffect,useState} from 'react'
import swal from 'sweetalert';
import axios from 'axios'
import { Link } from 'react-router-dom';
import productsroutes from '../../../../Routes/admin/modules/products/productsroutes';
import Loading from '../../../Partials/Loading';
import $ from 'jquery';
const Productimages=(props)=> {
    let textonbtn="Save Product";
  const [buttonText, setbuttonText] = useState(textonbtn);
 const [product, setproduct] = useState({
     product_name:'',
     product_color:'',
     product_code:'',
     product_image:''
 });
 const [loading, setloading] = useState(true);
 const [selectedfiles, setSelectedFiles] = useState([])
 const [error, seterror] = useState([]);
 const [image, setimage] = useState([])
 const HandleProductImage = e => {
   setimage({
     image:e.target.files
   })
  // this.setState({
  //   product_image: e.target.files
  // });
};

const submitForm = e => {
  e.preventDefault();
  const productslug=props.match.params.slug;

  //  const product = new FormData();
  //  if (this.state.product_image) {
  //     for (const file of this.state.product_image) {
  //       product.append("image", file);
  //     }
  //   }
  const formData = new FormData();
  // if (image.image) {
  //    for (const file of image.image) {
  //      formData.append("image", file);
  //    }
  //  }else{
  //    swal("There Is no image");
  //  }
  image.forEach((file_image)=>{
    formData.append('image[]',file_image);
  });
  //then use your API to send form data
  // ,{
  //   headers: {
  //   'content-type':'multipart/form-data'
  // }}
  axios.post(productsroutes.savemultipleproimages+productslug,formData).then(resp=>{
          switch (resp.data.status) {
            case 409:
              swal("warning",resp.data.msg,"warning")
              setbuttonText(textonbtn)
              break;
              case 400:
                swal("warning",resp.data.msg,"warning")
                      setbuttonText(textonbtn)
                  break;
                  case 401:
                    swal("warning",resp.data.msg,"warning")
                    setbuttonText(textonbtn)
                      break;         
                      case 404:
                swal("warning",resp.data.msg,"warning")
                setbuttonText(textonbtn)
                break;
                case 201:
                  // swal("warning",resp.data.msg,"warning")

                  setbuttonText(textonbtn)

                  break;
             case 200:
              swal("success",resp.data.msg,"success")
            //  setproduct(resp.data.product);   
            // alert(resp.data.product)
             setbuttonText(textonbtn)
               break;
              default:
                setbuttonText(textonbtn)

                  break;
          }
          setbuttonText(textonbtn)

  }).catch(error=>{
      swal("warning",error.message,"warning")
        setbuttonText(textonbtn)
    });
}
 const [products, setProducts] = useState({
   slider_images:''
  });
const [multipleFiles, setMultipleFiles] = useState([]);
 const MultipleFileChange = (e) => {
        setMultipleFiles(e.target.files);
        // setMultipleProgress(0);
        // console.log(multipleFiles[0].name);
        // console.log(multipleFiles);
    }
 const handleImage=(e)=>{
  setSelectedFiles([]);
  if (e.target.files) {
    const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setSelectedFiles((prevImages) => prevImages.concat(filesArray));
    Array.from(e.target.files).map(
      (file) => URL.revokeObjectURL(file)
    );
  }
  };
  const handleSliderImages = (e) => {
    if (e.target.files) {
    setProducts({ ...products, slider_images: [...e.target.files] });
    }
    console.log("Update slider images", products);
  };
  const renderphotos = (source) => {
    return source.map((photo) => {
      return <img className="p-2" src={photo} alt="" key={photo} style={{ width: "20%", height: "180px" }} />;
    });
  };

    useEffect(() => {
        const productslug=props.match.params.slug;
         axios.get(productsroutes.getaddmultipleproimages+productslug).then(resp=>{
             switch (resp.data.status) {
                 case 400:
                    swal("Warning",resp.data.msg,"warning")
                     break;
                case 404:
                    swal("Warning",resp.data.msg,"warning");
                    break;
                case 200:
                    setproduct(resp.data.product);
                    setloading(false);
                    break;   
                 default:
                     break;
             }
         }).catch(error=>{
             swal("Warning",error.message,"warning")
            });
        
    }, [props.match.params.slug]);
    //upload images
    function savemultipleimages(e){
        e.preventDefault();
        const productslug=props.match.params.slug;
        const formData = new FormData();
        // console.log(multipleFiles)
        for (let i = 0; i < multipleFiles.length; i++) {
            formData.append('image[]', multipleFiles[i]['name']);    
            alert(multipleFiles[i]);                  
        }
       


          axios.post(productsroutes.savemultipleproimages+productslug,formData,{
            headers: {
            'content-type':'multipart/form-data'
          }}).then(resp=>{
                  switch (resp.data.status) {
                    case 409:
                      swal("warning",resp.data.msg,"warning")
                      setbuttonText(textonbtn)
                      break;
                      case 400:
                        swal("warning",resp.data.msg,"warning")
                              setbuttonText(textonbtn)
                          break;
                          case 401:
                            swal("warning",resp.data.msg,"warning")
                            setbuttonText(textonbtn)
                              break;         
                              case 404:
                        swal("warning",resp.data.msg,"warning")
                        setbuttonText(textonbtn)
                        break;
                        case 201:
                          // swal("warning",resp.data.msg,"warning")

                          setbuttonText(textonbtn)

                          break;
                     case 200:
                      swal("success",resp.data.msg,"success")
                    //  setproduct(resp.data.product);   
                    // alert(resp.data.product)
                     setbuttonText(textonbtn)
                       break;
                      default:
                        setbuttonText(textonbtn)

                          break;
                  }
                  setbuttonText(textonbtn)

          }).catch(error=>{
              swal("warning",error.message,"warning")
                setbuttonText(textonbtn)
            });

    }
    const updatestatus=(e,id)=>{
      //  alert(id);
       e.preventDefault();
       const thisclicked=e.currentTarget;
       axios.put(productsroutes.updatemultipleproimagesstatus+id).then(resp=>{
         
          switch (resp.data.status) {
            case 400:
              swal("error",resp.data.msg,"error");
              break;
              case 404:
                swal("warning",resp.data.msg,"warning");
                break;
                case 200:
                swal("success",resp.data.msg,"success");
                  if(resp.data.newdata===0){
                    thisclicked.innerText="In Active";
                  }else if(resp.data.newdata===1){
                    thisclicked.innerText="Active";
                  }
                 
                break;
            default:
              break;
          }
       }).catch(error=>{
        swal("error",error.message,"error");
       });


    }
    const deleteproductimage=(e,id)=>{
      e.preventDefault();
      const thisclicked=e.currentTarget;
      if (window.confirm('Are you sure you wish to delete this item?')){
        thisclicked.innerText="Destroying...";
        axios.delete(productsroutes.deletemultipleproimages+id).then(resp=>{
          switch (resp.data.status) {
            case 400:
              swal("error",resp.data.msg,"error");
              thisclicked.innerText="Destroy";
              break;
            case 404:
              swal("warning",resp.data.msg,"warning");
              thisclicked.innerText="Destroy";
              break;  
             case 200:
               swal("success",resp.data.msg,"success");
               thisclicked.closest("tr").remove()
               break; 
          
            default:
              break;
          }
        }).catch(error=>{
          swal("error",error.message,"error");
          thisclicked.innerText="";
    
        });
      }
       
    }
    var data="";
    var sp="";
    if(loading){
        return  <Loading/>
    }
    // if(product.productimages){
    if (product.productimages && product.productimages.length>0) {

     data=product.productimages.map((pro)=>{
         return <tr key={pro.id}>
             <td>{product.product_name}</td>
             <td>{
                (pro.image)?
                <img src={`http://localhost:8000/Admin/Adminimages/ProductImages/multipleimages/small/${pro.image}`} alt={product.product_name} style={{ height:"60px"}}  />
 
                :
                <img src={`http://localhost:8000/Admin/Adminimages/noimage/noimage.jpg`} alt={product.product_name} width="50px" />
             }
             </td>
             <td>
             <Link style={{textDecoration:"none"}} onClick={(e)=>updatestatus(e,pro.id)}  href="javascript:void(0)" >{(pro.is_enabled==0 ? 'In Active':'Active')}</Link>

             </td>
             <td>
             <Link to="javasscript:void(0)" onClick={(e)=>deleteproductimage(e,pro.id)} className="fas fa-trash confirmdelete" title="trash product"></Link>

             </td>
         </tr>
     })
        
    // }
  }else{
        data=
      <h6 className="text-danger text-center">Product images not found</h6>
    }
    return (
        <Fragment>
        <div class="content-wrapper">
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Catalogues</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Product multiple images</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="container-fluid">
        
      {/* <form   onSubmit={savemultipleimages} role="form" encType="multipart/form-data"> */}
      <form   onSubmit={submitForm} role="form" encType="multipart/form-data">
            <div class="card card-default">
          <div class="card-header">
            <h3 class="card-title">Product multiple images form</h3>
            <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
              <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-remove"></i></button>
            </div>
          </div>          
            <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                
                  <div class="form-grop">
                      <label for="product_name" class="control-label">product name</label>
                      <input type="text" readonly disabled name="product_name" value={(product.product_name?product.product_name:'')}  class="form-control" placeholder="enter a product"/>
                      <span class="help-block text-danger"></span>
                  </div>
                      <div class="form-grop">
                  <label for="product_code" class="control-label">product code</label>
                  <input type="text" readonly disabled name="product_code" value={(product.product_code)?product.product_code:''}  id="product_code" class="form-control" placeholder="enter a product_code"/>
                  <span class="help-block text-danger"></span>
              </div>     
              </div>
              <div class="col-md-6">
              
              <div class="form-grop">
                <label for="product_color" class="control-label">product color</label>
                <input type="text" readonly disabled name="product_color" value={(product.product_color)?product.product_color:''} id="product_color" class="form-control" placeholder="enter a product color"/>
                <span class="help-block text-danger"></span>
            </div>
            <div class="form-group">
            <label for="product_image" class="control-label">product Image</label><br />

              {
                  (product.product_image)?
                  <img src={`http://localhost:8000/Admin/Adminimages/ProductImages/small/${product.product_image}`} alt={product.product_name}  />
                   :'No image'
              }
              </div>
          </div>
        <div class="col-md-6">
        <div className="form-group">
        {/* <input  type="file"  id="uploading" onChange={(e) => MultipleFileChange(e)} className="form-control" multiple  name="image[]" /> */}
        <input  type="file"  id="uploading" onChange={(e) => HandleProductImage(e)} className="form-control" multiple  name="image[]" />

        </div>
        {/* <div class={(error.productimage)? 'form-group text-danger':'form-group'}>
                <label for="exampleInputFile" class="control-label">Add Multiple product Images</label>
                <div class="input-group">
                  <div class="custom-file">
                  {/* <input className="ml-2" type="file" id="file" name="file[]" multiple onChange={handleImageChange} /> */}

                  {/* <input   name="file[]" type="file" multiple onChange={handleImage}  className={(error.image)? 'custom-file-input is-invalid':'custom-file-input'} id="exampleInputFile" /> */}
                   {/* <label class="custom-file-label" for="exampleInputFile">Choose file</label>
                  </div>
                  <div class="input-group-append">
                    <span class="input-group-text" id="">Upload</span>
                  </div>
                </div>
                <div className="result">
                  {renderphotos(selectedfiles)}
                </div>
                <span class="help-block text-danger">{error.image}</span>
              </div> */}
          
        </div>            
            </div>
          </div>
          <div class="card-footer">
           <button type="submit"  onClick={(e)=>setbuttonText("Saving...")} class="btn btn-primary">{buttonText}</button>
          </div>
        </div>

        </form>
        <div class="card">
            <div class="card-header">
              <h3 class="card-title">Products images</h3>
            </div>
            <div class="card-body">
              <table id="attributes" class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>product name </th>
                  <th>image </th>
                  <th>Status </th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data}
                       
                </tbody>
              </table>
            </div>
          
          </div>

      </div>
    </section>
  </div>

        </Fragment>
    )
}

export default Productimages
