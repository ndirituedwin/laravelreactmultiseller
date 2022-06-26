import axios from 'axios';
import React,{Fragment,useEffect,useState,useMemo} from 'react'
import { Link,useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import categoriesroutes from '../../../../Routes/admin/modules/Categories/categoriesroutes';
import Loading from '../../../Partials/Loading';
import Header from '../../DataTable/Pagination/Header';
import PaginationComponent from '../../DataTable/Pagination/PaginationComponent';
import Search from '../../DataTable/Pagination/Search';

const TrashedCategories=()=>{

  const history=useHistory();
    const [categories, setcategories] = useState([]);
    const [loading, setloading] = useState(true)
    const [totalcategories, settotalcategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sorting, setsorting] = useState({ field: "", order: "" });
    const CATEGORIES_PER_PAGE=10; 
    const [search, setsearch] = useState("");
    const headers=[
     {name:"category", field:"category_name",sortable: true},
    //  {name:"admin", field:"admin_id",sortable: true},
     {name:"status", field:"is_enabled",sortable: false},
     {name:"Actions", field:"Actions",sortable: false}
    ]
    useEffect(() => {
        axios.get(categoriesroutes.trashedcategories).then(resp=>{
            switch (resp.data.status) {
                case 400:
                    swal("warning",resp.data.msg,"warning")
                    break;
                case 200:
                   setcategories(resp.data.categories)   
                default:
                    break;
            }
            setloading(false);
        }).catch(error=>{
            swal("error",error.message,"error");
        });
    }, []);
    /**delete brand */
    const deletecategory=(e,slug)=>{
      e.preventDefault();
      const thisclicked=e.currentTarget;
      thisclicked.innerText="Destroying...";
      axios.delete(categoriesroutes.forcedeletecategory+slug).then(resp=>{
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
                  break;
                default:
                  break;
              }
              thisclicked.innerText="Destroy";
            }).catch(error=>{swal("error",error.message,"error")
      thisclicked.innerText="";

    });
    }
        /**restore category */
        const restorecategory=(e,slug)=>{
      e.preventDefault();
      const thisclicked=e.currentTarget;
      thisclicked.innerText="Restoring..."
      axios.get(categoriesroutes.restoretrashed+slug).then(resp=>{
           switch (resp.data.status) {
             case 400:
               swal("warning",resp.data.msg,"warning");
               break;
             case 404:
               swal("warning",resp.data.msg,"warning");
                break;
             case 200:
               swal("success",resp.data.msg,"success");
               thisclicked.closest("tr").remove()
                history.push("/admin/view/categories")
               break;
             default:
               break;
           }
           thisclicked.innerText="Destroy";
      }).catch(error=>{
        swal("error",error.message,"error")
        thisclicked.innerText="";
      });
    }
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

    var categorieslist="";
    if(loading){

      categorieslist=<Loading/>
    }else{
        if(categories.length===0){
            categorieslist=<center>
              <h5 className="text-center text-danger">No categories available</h5>
            </center>;
        }else{      
        categorieslist=allcategories.map((category)=>{
            return(
                <tr key={category.id}>
                  <td>{category.category_name}</td>
                  {/* <td>{category.admin.name}</td> */}
                  <td> 
                       <Link style={{textDecoration:"none"}}   to="javascript:void(0)" >{(category.is_enabled==0 ? 'In Active':'Active')}</Link>
                   </td>
                   <td> 
                   <Link onClick={(e)=>restorecategory(e,category.slug)} to="javascript:void(0)" style={{textDecoration:"none"}}   className="fas fa-recycle fa-2x" title="Restore"></Link>&nbsp;&nbsp;
                   <Link to="javasscript:void(0)" onClick={(e)=>deletecategory(e,category.slug)} className="fas fa-trash confirmdelete" title="permanently delete brand"></Link>
                     </td>

                </tr>
            )
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
          <h1>Categories page</h1>
        </div>
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><Link to="#">Home</Link></li>
            <li className="breadcrumb-item active">categories</li>
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
            <h3 className="card-title">Categories table</h3><br />
          </div>
            <Link className="btn btn-primary float-right" to="/admin/add/category">Add Category</Link>
            <div className="row">
     <div className="col-md-6"></div>
     <div className="col-md-6 d-flex flex-row-reverse">
     <Link to="/admin/view/categories" className="btn btn-success pull-right mt-1"><i className="fas fa-backward"></i> Back</Link>

     </div>
   </div>
          {/* /.card-header */}
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
              />
              <tbody>
              {categorieslist}

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

export default TrashedCategories
