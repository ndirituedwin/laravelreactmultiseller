import React,{useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Header({headers,onSorting}) { 
    const [sortingfield, setsortingfield] = useState("");
    const [sortingorder, setsortingorder] = useState("asc");
    const onSortingChange = (field) => {
        const order =
            field === sortingfield && sortingorder === "asc" ? "desc" : "asc";

            setsortingfield(field);
            setsortingorder(order);
        onSorting(field, order);
    };
    return (


        <thead>
        <tr>
            {headers.map(({ name, field, sortable }) => (
                <th
                    key={name}
                    onClick={() =>
                        sortable ? onSortingChange(field) : null
                    }
                >
                    {name}

                    {sortingfield && sortingfield === field && (
                        <FontAwesomeIcon
                            icon={
                                sortingorder === "asc"
                                    ? "arrow-down"
                                    : "arrow-up"
                            }
                        />
                    )}
                </th>
            ))}
        </tr>
    </thead>

       
    )
}

export default Header;
