import React, {useEffect, useState} from "react";
import OrderColumnsDraggeable from "./OrderColumnsDraggeable";

export default function OrderColumnsParams(props) {

    console.log(props)

    const [columns, setColumns] = useState()

    useEffect(() => {
        if(!columns && props.commonResult && props.commonResult.headers){
            setColumns(props.commonResult.headers)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, columns])

    return (
        <>
            <h3>Change order of columns</h3>
            {
                columns && <OrderColumnsDraggeable
                    columns={columns}
                    setColumns={setColumns}
                ></OrderColumnsDraggeable>
            }
        </>
    );
}
