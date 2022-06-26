import React,{useState,useEffect,useMemo} from 'react'
import  Pagination  from 'react-bootstrap/Pagination'
const PaginationComponent=({totalsections=0,
    sectionsperpge=10,
    currentPage=1,
    onPageChange})=> {
        const [totalPages, settotalPages] = useState(0)
         useEffect(() => {
             if(totalsections > 0 && sectionsperpge >0){
                 settotalPages(Math.ceil(totalsections / sectionsperpge));
             }
           
         }, [totalsections,sectionsperpge])
         const paginationItem=useMemo(() =>
         {
             const pages=[];
             for (let i = 1; i <= totalPages; i++) {
                pages.push(<Pagination.Item key={i} active={i===currentPage} onClick={()=>onPageChange(i)}>{i}</Pagination.Item>);                 
             }
             return pages;
        }
          
         , [totalPages,currentPage])

         if(totalPages===0) return null;
    return (
       <Pagination>
           <Pagination.Prev onClick={()=> onPageChange(currentPage-1)} disabled={currentPage===1}/>
           {paginationItem}
           <Pagination.Next onClick={()=>onPageChange(currentPage+1)} disabled={currentPage===totalPages}/>
       </Pagination>
    )
}
export default PaginationComponent;
