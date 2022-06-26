import React,{useState} from 'react'

const Search=({onSearch})=> {
    const [search, setsearch] = useState('');
    const onInputChange=(value)=>{
        setsearch(value);
        onSearch(value);
    }

    return (
        // <div className="col-md-6-flex-row-reverse">
            <input  type="text" className="form-control" style={{width:"240px"}} value={search} onChange={(e)=>onInputChange(e.target.value)} placeholder="search"/>
        // </div>
    )
}

export default Search
