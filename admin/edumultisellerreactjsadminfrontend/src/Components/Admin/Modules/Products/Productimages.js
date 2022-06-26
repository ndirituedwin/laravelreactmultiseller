import React,{Fragment,useEffect,useState,Component} from 'react'
import swal from 'sweetalert';
import axios from 'axios'
import { Link } from 'react-router-dom';
import productsroutes from '../../../../Routes/admin/modules/products/productsroutes';
import Loading from '../../../Partials/Loading';
import $ from 'jquery';
class Productimages extends Component {
  
    state={
      saving:'Saving...',
      loading:true,
      textonbtn:"Save Product",
      buttonText:"Save Product",
      selectedfiles:[],
      product:{
        product_name:'',
        product_color:'',
        product_code:'',
        product_image:'',
        imageArray: [],

      },
    }
    handleFileChange(e){
      if (e.target.files) {
        
          const files = Array.from(e.target.files);
          const promises = files.map(file => {
              return (new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.addEventListener('load', (ev) => {
                      resolve(ev.target.result);
                  });
                  reader.addEventListener('error', reject);
                  reader.readAsDataURL(file);
              }))
          });

          Promise.all(promises).then(images => {
              this.setState({
                  imageArray: images
              })
          }, error => { console.error(error); });
          

         

      }
      if (this.props.onChange !== undefined) {
          this.props.onChange(e);
      }
  }
    componentDidMount(){
    
      const productslug=this.props.match.params.slug;
      axios.get(productsroutes.getaddmultipleproimages+productslug).then(resp=>{
          switch (resp.data.status) {
              case 400:
                 swal("Warning",resp.data.msg,"warning")
                  break;
             case 404:
                 swal("Warning",resp.data.msg,"warning");
                 break;
             case 200:
               this.setState({product:resp.data.product})
                //  setproduct(resp.data.product);
                //  setloading(false);
                 this.setState({loading:false})
                 break;   
              default:
                  break;
          }
      }).catch(error=>{
          swal("Warning",error.message,"warning")
         });
     
    }

 
    
 submitForm = e => {
  e.preventDefault();
  const productslug=this.props.match.params.slug;
if(!this.state.imageArray ||this.state.imageArray===undefined){
 swal("warning","Select an image","warning");
}else{
  const formData = new FormData();
        this.state.imageArray.forEach((image_file) => {
             formData.append('file[]', image_file);
        });
    
  axios.post(productsroutes.savemultipleproimages+productslug,formData).then(resp=>{
          switch (resp.data.status) {
                  case 401:
                    swal("warning",resp.data.msg,"warning")
                    this.setState({buttonText:this.state.textonbtn})
                    break;         
                      case 404:
                swal("warning",resp.data.msg,"warning")
                this.setState({buttonText:this.state.textonbtn})
                break;
                
             case 200:
               swal("success",resp.data.msg,"success")
               this.setState({buttonText:this.state.textonbtn})  
              axios.get(productsroutes.getaddmultipleproimages+productslug).then(resp=>{
                switch (resp.data.status) {
                    case 400:
                       swal("Warning",resp.data.msg,"warning")
                        break;
                   case 404:
                       swal("Warning",resp.data.msg,"warning");
                       break;
                   case 200:
                     this.setState({product:resp.data.product})
                      //  setproduct(resp.data.product);
                      //  setloading(false);
                       this.setState({loading:false})
                       break;   
                    default:
                        break;
                }
            }).catch(error=>{
                swal("Warning",error.message,"warning")
               });
                   
               break;
              default:
                              this.setState({buttonText:this.state.textonbtn})

                  break;
          }
                        this.setState({buttonText:this.state.textonbtn})

  }).catch(error=>{
      swal("warning",error.message,"warning")
                      this.setState({buttonText:this.state.textonbtn})
    });
  }
}
     
     updatestatus=(e,id)=>{
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
     deleteproductimage=(e,id)=>{
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
   
    render(){

      var renderphotos = (source) => {
        return source.map((photo) => {
          return <img className="p-2" src={photo} alt="" key={photo} style={{ width: "20%", height: "180px" }} />;
        });
      };
      var data="";
      var sp="";
      if(this.state.loading===true){
          return  <Loading/>
      }
      // if(product.productimages){
      if (this.state.product.productimages && this.state.product.productimages.length>0) {
  
       data=this.state.product.productimages.map((pro)=>{
           return <tr key={pro.id}>
               <td>{this.state.product.product_name}</td>
               <td>{
                  (pro.image)?
                  <img src={`http://localhost:8000/Admin/Adminimages/ProductImages/multipleimages/small/${pro.image}`} alt={this.state.product.product_name} style={{ height:"60px"}}  />
   
                  :
                  <img src={`http://localhost:8000/Admin/Adminimages/noimage/noimage.jpg`} alt={this.state.product.product_name} width="50px" />
               }
               </td>
               <td>
               <Link style={{textDecoration:"none"}} onClick={(e)=>this.updatestatus(e,pro.id)}  href="javascript:void(0)" >{(pro.is_enabled==0 ? 'In Active':'Active')}</Link>
  
               </td>
               <td>
               <Link to="javasscript:void(0)" onClick={(e)=>this.deleteproductimage(e,pro.id)} className="fas fa-trash confirmdelete" title="trash product"></Link>
  
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
      <form   onSubmit={this.submitForm} role="form" encType="multipart/form-data">
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
                      <input type="text" readonly disabled name="product_name" value={(this.state.product.product_name?this.state.product.product_name:'')}  class="form-control" placeholder="enter a product"/>
                      <span class="help-block text-danger"></span>
                  </div>
                      <div class="form-grop">
                  <label for="product_code" class="control-label">product code</label>
                  <input type="text" readonly disabled name="product_code" value={(this.state.product.product_code)?this.state.product.product_code:''}  id="product_code" class="form-control" placeholder="enter a product_code"/>
                  <span class="help-block text-danger"></span>
              </div>     
              </div>
              <div class="col-md-6">
              
              <div class="form-grop">
                <label for="product_color" class="control-label">product color</label>
                <input type="text" readonly disabled name="product_color" value={(this.state.product.product_color)?this.state.product.product_color:''} id="product_color" class="form-control" placeholder="enter a product color"/>
                <span class="help-block text-danger"></span>
            </div>
            <div class="form-group">
            <label for="product_image" class="control-label">product Image</label><br />

              {
                  (this.state.product.product_image)?
                  <img src={`http://localhost:8000/Admin/Adminimages/ProductImages/small/${this.state.product.product_image}`} alt={this.state.product.product_name}  />
                   :'No image'
              }
              </div>
          </div>
        <div class="col-md-6">
        <div className="form-group">
        <input  type="file"  id="uploading" onChange={(e) => this.handleFileChange(e)} className="form-control" multiple  name="file[]" />
        <div className="result">
                  {renderphotos(this.state.selectedfiles)}
                </div>
        </div>
        
          
        </div>            
            </div>
          </div>
          <div class="card-footer">
           <button type="submit" onClick={(e)=>this.state.saving}  class="btn btn-primary">{this.state.buttonText}</button>
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
}

export default Productimages
