import axios from 'axios';
import React,{Fragment,useEffect,useState,useMemo} from 'react'
import {Link} from 'react-router-dom';
import swal from 'sweetalert';
import PaginationComponent from '../../DataTable/Pagination/PaginationComponent';
import Header from '../../DataTable/Pagination/Header';
import Search from '../../DataTable/Pagination/Search';

import Loading from '../../../Partials/Loading'
import productsroutes from '../../../../Routes/admin/modules/products/productsroutes';
function ViewProducts() {
   const [products, setproducts] = useState([])
    const [loading, setloading] = useState(true);
    const [totalproducts, settotalproducts] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [sorting, setsorting] = useState({ field: "", order: "" });
 const PRODUCTS_PER_PAGE=10; 
 const [search, setsearch] = useState("");
 const headers=[
  {name:"product name", field:"product_name",sortable: true},
  {name:"shop", field:"shop_id",sortable: true},
  {name:"category", field:"category_id",sortable: true},
  {name:"section", field:"section_id",sortable: true},
  {name:"brand", field:"brand_id",sortable: true},
  {name:"product image", field:"productimage",sortable: false},
  {name:"status", field:"is_enabled",sortable: false},
  {name:"Actions", field:"Actions",sortable: false}
 ]
 
 const allproducts=useMemo(() => {
  let computeproducts=products;
  if(search){ 
   computeproducts=computeproducts.filter(
     product=>
     product.product_name.toLowerCase().includes(search.toLowerCase()) ||
     product.category.category_name.toLowerCase().includes(search.toLowerCase()) ||
     product.section.section.toLowerCase().includes(search.toLowerCase()) ||
     product.brand.brand.toLowerCase().includes(search.toLowerCase()) 
   )
  }
  settotalproducts(computeproducts.length);
          //Sorting comments
          if (sorting.field) {
         const reversed = sorting.order === "asc" ? 1 : -1;
         computeproducts = computeproducts.sort(
             (a, b) =>
                 reversed * a[sorting.field].toString().localeCompare(b[sorting.field])
         );
     }
     //Current Page slice
 
  return computeproducts.slice(
    (currentPage-1)* PRODUCTS_PER_PAGE,
    (currentPage-1)*PRODUCTS_PER_PAGE+PRODUCTS_PER_PAGE);
}, [products,currentPage,search,sorting])
      /**delete section */
   const deleteproduct=(e,slug)=>{
    e.preventDefault();
    const thisclicked=e.currentTarget;
    thisclicked.innerText="Trashing...";
    axios.delete(productsroutes.deleteproduct+slug).then(resp=>{
      switch (resp.data.status) {
        case 400:
          swal("error",resp.data.msg,"error");
          thisclicked.innerText="Trash";
          break;
        case 404:
          swal("warning",resp.data.msg,"warning");
          thisclicked.innerText="Trash";
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
  /** end of product delete */
  /**Update product status */
  const updatestatus=(e,slug)=>{
    e.preventDefault();
    const thisclicked=e.currentTarget;
    axios.put(productsroutes.updateproductstatus+slug).then(resp=>{
      
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
  /**end of update product status */
    useEffect(() => {
      axios.get(productsroutes.viewproducts).then(resp=>{
        switch (resp.data.status) {
          case 400:
            swal("error",resp.data.msg,"error");
            break;
              case 200:
              setproducts(resp.data.products)
                  setloading(false);
              break;
          default:
            break;
        }
      }).catch(error=>{swal("warning",error.message,"warning")})
    }, [])

    var data="";
    if (loading) {
        data=<Loading/>
      
    }else{
      if(products.length>0){
        data=allproducts.map((product)=>{
         return (
            <tr key={product.id}>
               <td>{product.product_name}</td>
               {(product.section)?product.section.shop.shop:''}
               <td>{(product.category)?product.category.category_name:''}</td>
               <td>{(product.section)?product.section.section:''}</td>
               <td>{(product.brand)?product.brand.brand:''}</td>
               {
                (product.product_image)?
                <img src={`http://localhost:8000/Admin/Adminimages/ProductImages/small/${product.product_image}`} alt={product.product_name} width="50px" />
                :
                <img src={`http://localhost:8000/Admin/Adminimages/noimage/noimage.jpg`} alt={product.product_name} width="50px" />
              }
               <td>          
                      <Link style={{textDecoration:"none"}} onClick={(e)=>updatestatus(e,product.slug)}  href="javascript:void(0)" >{(product.is_enabled==0 ? 'In Active':'Active')}</Link>
                    </td>
                    <td>
                    <Link style={{textDecoration:"none"}} to={`/admin/edit/add-product-attribute/${product.slug}`} className="fas fa-plus" title="add product attribute "></Link>&nbsp;&nbsp;&nbsp;
                    <Link style={{textDecoration:"none"}} to={`/admin/edit/add-multiple-product-images/${product.slug}`} className="fas fa-plus-circle" title="add product images "></Link>&nbsp;&nbsp;&nbsp;
                    <Link to={`/admin/edit/edit-product/${product.slug}`} className="fas fa-edit" title="edit product "></Link>&nbsp;&nbsp;&nbsp;
                    <Link to="javasscript:void(0)" onClick={(e)=>deleteproduct(e,product.slug)} className="fas fa-trash confirmdelete" title="trash product"></Link>
                      </td>          </tr>
          )
        })
      }else{
        data=<h4 className="text-center text-danger">No data availabled</h4>
      }
    }

  return (
        <Fragment>
<div className="content-wrapper">
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1>Products</h1>
        </div>
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><Link to="#">Home</Link></li>
            <li className="breadcrumb-item active">Products</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section className="content">
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Products table</h3>
          </div>
          <Link to="/admin/add/product" className="btn btn-success">Add product</Link><br />
          <div className="row">
     <div className="col-md-6"></div>
     <div className="col-md-6 d-flex flex-row-reverse">
     <Link to="/admin/view/trashed-products" className="btn btn-success pull-right mt-1"><i className="fas fa-recycle"></i> Bin</Link>

     </div>
   </div> 
          <div className="card-body">
          <div className="row">
         <div className="col-md-6">
         <PaginationComponent
           totalsections={totalproducts}
           sectionsperpge={PRODUCTS_PER_PAGE}
           currentPage={currentPage}
           onPageChange={page=>setCurrentPage(page)}
         />
          </div>
          <div className=" col-md-6 d-flex flex-row-reverse">
          <Search  onSearch={(value)=>{setsearch(value); setCurrentPage(1);}}/>
        </div>
         </div>
            <table id="products" className="table table-bordered table-hover">
            <Header
              headers={headers}
                            onSorting={(field, order) =>
                                setsorting({ field, order })
                            }
             
             
              // headers={headers} onSorting={(field,order)=>setsorting({field,order})}

              />
              {/* <thead>
                <tr>
                  <th>product name </th>
                  <th>product category</th>
                  <th>product section</th>
                  <th>product brand</th>
                  <th>product status</th>
                  <th>Actions</th>
                </tr>
              </thead> */}
              <tbody>
              {data}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Products Table</h3>
          </div>
        </div>
      </div>
    </div></section>
</div>
        </Fragment>
    )
}

export default ViewProducts
