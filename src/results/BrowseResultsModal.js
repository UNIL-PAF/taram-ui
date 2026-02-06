import React, {useEffect, useState} from 'react';
import {Button} from 'antd';
import {addResult, getAvailableDirs} from "./BackendResults"
import {useDispatch} from "react-redux";
import BrowseResultForm from "./BrowseResultForm";

export function BrowseResultsModal({buttonText, refreshResults}) {

    const [selResDir, setSelResDir] = useState();
    const [fltDirs, setFltDirs] = useState();
    const [selType, setSelType] = useState();
    const [selFile, setSelFile] = useState();
    const [visible, setVisible] = useState(false);
    const [availableDirs, setAvailableDirs] = useState();
    const [status, setStatus] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        getAvailableDirs(setVisible, setAvailableDirs, setStatus)
    }, [])

    const resetFltDirs = (type) => {
        if (availableDirs) {
            setFltDirs(availableDirs.filter((a) => a.type === type))
        }
    }

    useEffect(() => {
        if(status === "loading"){
            setSelFile(undefined)
            setFltDirs(undefined)
            setSelResDir(undefined)
        }else if(status === "done"){
            resetFltDirs(selType)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    const onCreate = (values) => {
        const selDir = availableDirs.find((a) => a.type === values.type && a.path === values.resDir)
        let localVals = values
        localVals.path = selDir.path
        localVals.resFile = selFile
        localVals.fileCreationDate = selDir.fileCreationDate
        localVals.runPTXQC = (localVals.type !== "MaxQuant") ? false : localVals.runPTXQC;
        dispatch(addResult(localVals))
       setVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={() => setVisible(true)}>
                {buttonText}
            </Button>
            <BrowseResultForm
                selResDir={selResDir}
                setSelResDir={setSelResDir}
                resetFltDirs={resetFltDirs}
                fltDirs={fltDirs}
                selType={selType}
                setSelType={setSelType}
                status={status}
                setSelFile={setSelFile}
                selFile={selFile}
                visible={visible}
                onCreate={onCreate}
                refreshData={() => getAvailableDirs(setVisible, setAvailableDirs, setStatus)}
                onCancel={() => {
                    setVisible(false);
                }}
                availableDirs={availableDirs}
            />
        </>
    );
};
