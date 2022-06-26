import axios from 'axios';
import React,{useState,useEffect,useMemo} from 'react'
import { Link,useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import sectionsroutes from '../../../../Routes/admin/modules/Sections/sectionsroutes';
import PaginationComponent from '../../DataTable/Pagination/PaginationComponent';
import Header from '../../DataTable/Pagination/Header';
import Search from '../../DataTable/Pagination/Search';

function TrashedSections() {
  const history=useHistory();
 const [sections, setsections] = useState([]);
 const [loading, setloading] = useState(true)
 const [totalsections, settotalsections] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [sorting, setsorting] = useState({ field: "", order: "" });
 const SECTIONS_PER_PAGE=10; 
 const [search, setsearch] = useState("");
 const headers=[
  {name:"section", field:"section",sortable: true},
//   {name:"admin", field:"admin_id",sortable: true},
  {name:"status", field:"is_enabled",sortable: false},
  {name:"Actions", field:"Actions",sortable: false}
 ]
  useEffect(() =>{
    axios.get(sectionsroutes.trashedections).then(resp=>{
      switch (resp.data.status) {
        case 400:
          swal("error",resp.data.msg,"error");
          break;
        case 200:
           setsections(resp.data.sections);
            break;  
        default:
          break;
      }
      setloading(false)
    }).catch(err=>{
      swal("warning",err.message,"error");
    });
     
   }, [])
   const allsections=useMemo(() => {
     let computesections=sections;
     if(search){ 
      computesections=computesections.filter(
        section=>
        section.section.toLowerCase().includes(search.toLowerCase()) 
        // section.admin.name.toLowerCase().includes(search.toLowerCase()) 
      )
     }
     settotalsections(computesections.length);
             //Sorting comments
             if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computesections = computesections.sort(
                (a, b) =>
                    reversed * a[sorting.field].toString().localeCompare(b[sorting.field])
            );
        }
        //Current Page slice
    
     return computesections.slice(
       (currentPage-1)* SECTIONS_PER_PAGE,
       (currentPage-1)*SECTIONS_PER_PAGE+SECTIONS_PER_PAGE);
   }, [sections,currentPage,search,sorting])
   /**delete section */
   const deletesection=(e,slug)=>{
     e.preventDefault();
     const thisclicked=e.currentTarget;
     thisclicked.innerText="Destroying...";
     axios.delete(sectionsroutes.forcedeletesection+slug).then(resp=>{
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
   /** end of section delete */
   /**restore brand */
   const restoresection=(e,slug)=>{
      e.preventDefault();
      const thisclicked=e.currentTarget;
      thisclicked.innerText="Restoring..."
      axios.get(sectionsroutes.restoretrashed+slug).then(resp=>{
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
                history.push("/admin/view/sections")
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
   /**end of update section status */
   var SECTIONLIST="";
   if(loading){
    return (
      <div className="content-wrapper mt-5" >
        <center>
        <Loader
       type="Puff"
       color="#00BFFF"
       height={50}
       width={50}
       timeout={3000} //3 secs
     />
</center>
     </div>
     );
   }else{
      SECTIONLIST=allsections.map((section)=>{
       
      
       return(
         <tr key={section.id}>
                  <td>{section.section}</td>
                   {/* <td>{section.admin.name}</td> */}
                  <td> 
                    <Link style={{textDecoration:"none"}}  to="#" >{(section.is_enabled==0 ? 'In Active':'Active')}</Link>
                   
                  </td>
                  <td>
                  <Link onClick={(e)=>restoresection(e,section.slug)} to="javascript:void(0)" style={{textDecoration:"none"}}   className="fas fa-recycle fa-2x" title="Restore"></Link>&nbsp;&nbsp;
                  <Link to="javasscript:void(0)" onClick={(e)=>deletesection(e,section.slug)} className="fas fa-trash confirmdelete" title="Delete permanently"></Link>
                    </td>
                </tr>
       )
     })
   }

    return (
        <div>
<div className="content-wrapper">
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1>Section page</h1>
        </div>
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><Link to="/admin">Home</Link></li>
            <li className="breadcrumb-item active">Sections</li>
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
            <h3 className="card-title">Sections table</h3>

          </div>
             <div className="row">
               <div className="col-md-6"></div>
               <div className="col-md-6 d-flex flex-row-reverse">
            <Link to="/admin/view/sections" className="btn btn-primary pull-right">Go back</Link>

               </div>
             </div>
          <div className="card-body">
         <div className="row">
         <div className="col-md-6">
         <PaginationComponent
           totalsections={totalsections}
           sectionsperpge={SECTIONS_PER_PAGE}
           currentPage={currentPage}
           onPageChange={page=>setCurrentPage(page)}
         />
          </div>
          <div className=" col-md-6 d-flex flex-row-reverse">
          <Search  onSearch={(value)=>{setsearch(value); setCurrentPage(1);}}/>
        </div>
         </div>
            <table id="sections" className="table table-bordered table-hover table-striped">
             <Header
              headers={headers}
                            onSorting={(field, order) =>
                                setsorting({ field, order })
                            }
             
             
              // headers={headers} onSorting={(field,order)=>setsorting({field,order})}

              />
              <tbody>
                {SECTIONLIST}
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

        </div>
      

    )
}

export default TrashedSections
