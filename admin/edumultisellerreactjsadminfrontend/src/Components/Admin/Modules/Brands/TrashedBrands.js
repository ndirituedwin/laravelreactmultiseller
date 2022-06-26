import axios from 'axios';
import React,{Fragment,useEffect,useState,useMemo} from 'react'
import ReactPaginate from 'react-paginate';
import { Link,useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import brandsroutes from '../../../../Routes/admin/modules/Brands/brandsroutes';
import Loading from '../../../Partials/Loading';
import Header from '../../DataTable/Pagination/Header';
import PaginationComponent from '../../DataTable/Pagination/PaginationComponent';
import Search from '../../DataTable/Pagination/Search';

const TrashedBrands=()=>{

  const history=useHistory();
    const [brands, setbrands] = useState([]);
    const [loading, setloading] = useState(true)
    const [totalbrands, settotalbrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sorting, setsorting] = useState({ field: "", order: "" });
    const BRANDS_PER_PAGE=10; 
    const [search, setsearch] = useState("");
    const headers=[
     {name:"brand", field:"brand",sortable: true},
    //  {name:"admin", field:"admin_id",sortable: true},
     {name:"status", field:"is_enabled",sortable: false},
     {name:"Actions", field:"Actions",sortable: false}
    ]
    useEffect(() => {
        axios.get(brandsroutes.trashedbrands).then(resp=>{
            switch (resp.data.status) {
                case 400:
                    swal("warning",resp.data.msg,"warning")
                    break;
                case 200:
                   setbrands(resp.data.brands)   
                default:
                    break;
            }
            setloading(false);
        }).catch(error=>{
            swal("error",error.message,"error");
        });
    }, []);
    /**delete brand */
    const deletebrand=(e,slug)=>{
      e.preventDefault();
      const thisclicked=e.currentTarget;
      thisclicked.innerText="Destroying...";
      axios.delete(brandsroutes.forcedeletebrand+slug).then(resp=>{
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
    /**restore brand */
    const restorebrand=(e,slug)=>{
      e.preventDefault();
      const thisclicked=e.currentTarget;
      thisclicked.innerText="Restoring..."
      axios.get(brandsroutes.restoretrashed+slug).then(resp=>{
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
                history.push("/admin/view/brands")
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
const allbrands=useMemo(() => {
  let computebrands=brands;
  if(search){ 
   computebrands=computebrands.filter(
     brand=>
     brand.brand.toLowerCase().includes(search.toLowerCase()) 
    //  brand.admin.name.toLowerCase().includes(search.toLowerCase()) 
   )
  }
  settotalbrands(computebrands.length);
          //Sorting comments
          if (sorting.field) {
         const reversed = sorting.order === "asc" ? 1 : -1;
         computebrands = computebrands.sort(
             (a, b) =>
                 reversed * a[sorting.field].toString().localeCompare(b[sorting.field])
         );
     }
     //Current Page slice
 
  return computebrands.slice(
    (currentPage-1)* BRANDS_PER_PAGE,
    (currentPage-1)*BRANDS_PER_PAGE+BRANDS_PER_PAGE);
}, [brands,currentPage,search,sorting])
/**end of paging and sorting */

    var brandslist="";
    if(loading){

      brandslist=<Loading/>
    }else{
        if(brands.length===0){
            brandslist=<center>
              <h5 className="text-center text-danger">No Brands available</h5>
            </center>;
        }else{      
        brandslist=allbrands.map((brand)=>{
            return(
                <tr key={brand.id}>
                  <td>{brand.brand}</td>
                  {/* <td>{brand.admin.name}</td> */}
                  <td> 
                       <Link style={{textDecoration:"none"}}   to="javascript:void(0)" >{(brand.is_enabled==0 ? 'In Active':'Active')}</Link>
                   </td>
                   <td> 
                   <Link onClick={(e)=>restorebrand(e,brand.slug)} to="javascript:void(0)" style={{textDecoration:"none"}}   className="fas fa-recycle fa-2x" title="Restore"></Link>&nbsp;&nbsp;
                   <Link to="javascript:void(0)" onClick={(e)=>deletebrand(e,brand.slug)} className="fas fa-trash fa-2x confirmdelete" title="permanently delete brand"></Link>
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
          <h1>brands page</h1>
        </div>
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><Link to="#">Home</Link></li>
            <li className="breadcrumb-item active">brands</li>
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
            <h3 className="card-title">brands table</h3><br />
          </div>
            <Link className="btn btn-primary float-right" to="/admin/add/brand">Add brand</Link>
            <div className="row">
     <div className="col-md-6"></div>
     <div className="col-md-6 d-flex flex-row-reverse">
     <Link to="/admin/view/brands" className="btn btn-success pull-right mt-1"><i className="fas fa-backward"></i> Back</Link>

     </div>
   </div>
          {/* /.card-header */}
          <div className="card-body">
          <div className="row">
         <div className="col-md-6">
         <PaginationComponent
           totalsections={totalbrands}
           sectionsperpge={BRANDS_PER_PAGE}
           currentPage={currentPage}
           onPageChange={page=>setCurrentPage(page)}
         />
          </div>
          <div className=" col-md-6 d-flex flex-row-reverse">
          <Search  onSearch={(value)=>{setsearch(value); setCurrentPage(1);}}/>
        </div>
         </div>
            <table id="brands" className="table table-bordered table-hover">
            <Header
              headers={headers}
                            onSorting={(field, order) =>
                                setsorting({ field, order })
                            }
              />
              <tbody>
              {brandslist}

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

export default TrashedBrands
