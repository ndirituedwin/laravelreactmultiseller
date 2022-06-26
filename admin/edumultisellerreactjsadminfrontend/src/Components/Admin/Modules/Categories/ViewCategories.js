import axios from 'axios'
import React, { Fragment,useState,useEffect,useMemo} from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'
import categoriesroutes from '../../../../Routes/admin/modules/Categories/categoriesroutes'
import Loading from '../../../Partials/Loading'
import Header from '../../DataTable/Pagination/Header'
import PaginationComponent from '../../DataTable/Pagination/PaginationComponent'
import Search from '../../DataTable/Pagination/Search'
function ViewCategories() {
  const [categories, setcategories] = useState([])
  const [loading, setloading] = useState(true)
  const [totalcategories, settotalcategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setsorting] = useState({ field: "", order: "" });
  const CATEGORIES_PER_PAGE=10; 
  const [search, setsearch] = useState("");
  const headers=[
    {name:"category", field:"category_name",sortable: true},
    {name:"section", field:"section_id",sortable: true},
    {name:"parent", field:"parent_id",sortable: true},
    {name:"admin", field:"admin_id",sortable: true},
    {name:"category_image:",field:"category_image",sortable: false},
    {name:"status", field:"is_enabled",sortable: false},
    {name:"Actions", field:"Actions",sortable: false}
   ]
  /**update category status */
  const updatecategorystatus=(e,slug)=>{
    e.preventDefault();
    // alert(slug)
    const thisclicked=e.currentTarget;
    axios.put(categoriesroutes.updatecategoriestatus+slug).then(resp=>{
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
    });

  }
  /**delete category */
     const deletecategory=(e,slug)=>{
      e.preventDefault();
      const thisclicked=e.currentTarget;
      thisclicked.innerText="Trashing...";
      axios.delete(categoriesroutes.deletecategory+slug).then(resp=>{
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
              thisclicked.innerText="Trash";
            }).catch(error=>{swal("error",error.message,"error")
      thisclicked.innerText="";

    });
    }
  /**end */
  /**end */
  /**paging and soring */
const allcategories=useMemo(() => {
  let computecategories=categories;
  if(search){ 
   computecategories=computecategories.filter(
     category=>
     category.category_name.toLowerCase().includes(search.toLowerCase()) 
    //  brand.admin.name.toLowerCase().includes(search.toLowerCase()) 
   )
  }
  settotalcategories(computecategories.length);
          //Sorting comments
          if (sorting.field) {
         const reversed = sorting.order === "asc" ? 1 : -1;
         computecategories = computecategories.sort(
             (a, b) =>
                 reversed * a[sorting.field].toString().localeCompare(b[sorting.field])
         );
     }
     //Current Page slice
 
  return computecategories.slice(
    (currentPage-1)* CATEGORIES_PER_PAGE,
    (currentPage-1)*CATEGORIES_PER_PAGE+CATEGORIES_PER_PAGE);
}, [categories,currentPage,search,sorting])
/**end of paging and sorting */

  useEffect(() => {
     axios.get(categoriesroutes.viewcategories).then(resp=>{
       switch (resp.data.status) {
         case 400:
             swal("warning",resp.data.msg,"warning");
           break;
           case 200:
             setcategories(resp.data.categories)
            break;   
         default:
           break;
       }
       setloading(false);
     }).catch(error=>{swal("error",error.message,"error")});
  }, [])
  
  var data=""
  if(loading){
    
     data=<Loading/>
    
  }else{
    if(allcategories.length>0){
    data=allcategories.map((cat)=>{
      
             return (
               
              <tr key={cat.id}>
              <td>{cat.category_name}</td>
              <td>{(cat.section)?cat.section.section:''}</td>
              <td>{(cat.parentcategory===null)?'Parent':cat.parentcategory.category_name}</td>
              <td>{cat.admin.name}</td>
              <td>
              {
                (cat.category_image)?
                <img src={`http://localhost:8000/Admin/Adminimages/Categoryimages/${cat.category_image}`} alt={cat.category_name} width="50px" />
                :
                <img src={`http://localhost:8000/Admin/Adminimages/noimage/noimage.jpg`} alt={cat.category_name} width="50px" />
              }
              </td>
              <td>
                <Link style={{textDecoration:"none"}} to="javasscript:void(0)" onClick={(e)=>updatecategorystatus(e,cat.slug)} >{(cat.is_enabled===0)?'In Active':'Active'}</Link>
              </td>
              <td>
              <Link to={`/admin/edit/edit-category/${cat.slug}`} className="fas fa-edit" title="edit category "></Link>&nbsp;&nbsp;&nbsp;
              <Link to="javasscript:void(0)" onClick={(e)=>deletecategory(e,cat.slug)} className="fas fa-trash " title="trash category"></Link>
              </td>
            </tr>
             )
    })
  }else{
    data=<h4 className="text-center text-danger">No categories found</h4>
  }

  }
    return (
        <Fragment>
          <div className="content-wrapper">
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1>Category</h1>
        </div>
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><Link to="#">Home</Link></li>
            <li className="breadcrumb-item active">Categories</li>
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
            <h3 className="card-title">Categories table</h3>
          </div>
          <Link to="/admin/add/category" className="btn btn-success">Add category</Link><br />
          <div className="row">
     <div className="col-md-6"></div>
     <div className="col-md-6 d-flex flex-row-reverse">
     <Link to="/admin/view/trashed-categories" className="btn btn-success pull-right mt-1"><i className="fas fa-recycle"></i> Bin</Link>

     </div>
   </div>
          <div className="card-body">
          <div className="row">
         <div className="col-md-6">
         <PaginationComponent
           totalsections={totalcategories}
           sectionsperpge={CATEGORIES_PER_PAGE}
           currentPage={currentPage}
           onPageChange={page=>setCurrentPage(page)}
         />
          </div>
          <div className=" col-md-6 d-flex flex-row-reverse">
          <Search  onSearch={(value)=>{setsearch(value); setCurrentPage(1);}}/>
        </div>
         </div>
            <table id="categories" className="table table-bordered table-hover">
            <Header
              headers={headers}
                            onSorting={(field, order) =>
                                setsorting({ field, order })
                            }
             
             
              // headers={headers} onSorting={(field,order)=>setsorting({field,order})}

              />
              <tbody>
              {data}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">DataTable with default features</h3>
          </div>
        </div>
      </div>
    </div></section>
</div>

        </Fragment>
    )
}

export default ViewCategories
