import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllTemplates} from "./BackendTemplates";
import {Alert, message} from 'antd';
import TemplatesTable from "./TemplatesTable";

export default function Templates() {
    const dispatch = useDispatch();
    const templatesData = useSelector(state => state.templates.data)
    const templatesStatus = useSelector(state => state.templates.status)
    const templatesError = useSelector(state => state.templates.error)

    useEffect(() => {
        if (templatesStatus === 'idle') {
            dispatch(fetchAllTemplates())
            message.config({top: 60})
        }
    }, [templatesStatus, templatesData, dispatch])


    return (
        <div>
            {templatesError && <Alert
                message="Error"
                description={templatesError}
                type="error"
                showIcon
                closable
            />}
           <TemplatesTable data={templatesData}></TemplatesTable>
        </div>
    );
}
