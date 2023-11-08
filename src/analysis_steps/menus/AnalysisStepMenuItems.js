import React, {useEffect, useState, useRef} from "react";
import {Button, Menu, message, Popconfirm} from "antd";
import {useDispatch} from "react-redux";
import '../../analysis/analysis.css'
import {CloseOutlined} from "@ant-design/icons";
import {addAnalysisStep, deleteAnalysisStep, setStepParameters} from "../BackendAnalysisSteps";
import {clearTable} from "../../protein_table/proteinTableSlice";
import {prepareTTestParams} from "../t_test/TTestPrepareParams"
import DownloadZipModal from "./DownloadZipModal"
import ParameterModal from "./ParametersModal"
import {setStopMenuShortcut} from "../../analysis/analysisSlice";

export default function AnalysisStepMenuItems(props) {
    const [showModalName, setShowModalName] = useState()
    const [showStepParams, setShowStepParams] = useState(undefined)
    const [newStepParams, setNewStepParams] = useState(null)
    const [startDownload, setStartDownload] = useState(undefined)
    const [prepareParams, setPrepareParams] = useState()
    const [openMenuKeys, setOpenMenuKeys] = useState()
    const dispatch = useDispatch();
    const menuRef = useRef(null);

    useEffect(() => {
        if(showModalName){
            dispatch(setStopMenuShortcut(true))
        }else{
            dispatch(setStopMenuShortcut(false))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModalName])


    const findChildByName = (myRef, name) => {
        const children = Object.values(myRef.children)
        let selChild;
        if(children.length >= 1){
             children.forEach( c => {
                 if(c.innerText && c.innerText.includes(name) && c.className.includes("ant-dropdown-menu-submenu-title")){
                     selChild = c;
                 }else if(!selChild){
                     selChild = findChildByName(c, name)
                 }
                 if(selChild) return
            })

            if(selChild){
                return selChild
            }else{
                return undefined
            }
        }else{
            return undefined
        }
    }

    // Add event listeners
    useEffect(() => {
        if(props.showMenuItem && menuRef){
            setOpenMenuKeys([props.showMenuItem])
            const menuItem = findChildByName(menuRef.current, "Add a following step")
            setTimeout(() => {
                menuItem.focus()
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.showMenuItem, menuRef]);

    // If pressed key is our target key then set to true
    function downHandler(e) {
        if(e.key === "Escape"){
            closeMenu()
        }
    }

    // Add event listeners
    useEffect(() => {
        if(props.showMenuItem){
            window.addEventListener("keydown", downHandler);
            // Remove event listeners on cleanup
            return () => {
                window.removeEventListener("keydown", downHandler);
                closeMenu()
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.showMenuItem]); // Empty array ensures that effect is only run on mount and unmount

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (menuRef.current && event.target.id !== "menu-item" && event.target.role !== "menuitem" && !menuRef.current.contains(event.target)) {
                closeMenu()
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuRef])

    useEffect(() => {
        if (startDownload === false) {
            setStartDownload(undefined)
            setShowModalName(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDownload])

    const handleParamsOk = () => {
        dispatch(clearTable())
        setShowModalName(undefined)
        // parameters for existing step
        if (!showStepParams) {
            const params = props.prepareParams ? props.prepareParams(props.stepParams) : props.stepParams

            dispatch(setStepParameters({
                resultId: props.resultId,
                stepId: props.stepId,
                params: params
            }))

            // parameters for new step
        } else {
            const params = prepareParams ? prepareParams(newStepParams) : newStepParams

            const stepObj = {
                stepId: props.stepId,
                resultId: props.resultId,
                newStep: {type: showStepParams, params: JSON.stringify(params)}
            }
            dispatch(addAnalysisStep(stepObj))
            setShowStepParams(undefined)
        }
    };

    const handleCancel = () => {
        setShowModalName(undefined)
        setShowStepParams(undefined)
        setNewStepParams(null)
        dispatch(clearTable())
    };

    const confirmDelete = () => {
        dispatch(deleteAnalysisStep({stepId: props.stepId, resultId: props.resultId}))
        message.success('Delete ' + getType() + '.');
    };

    const showModal = (name, newStepParams) => {
        const myParams = showStepParams ? newStepParams : props.stepParams
        const mySetParams = showStepParams ? setNewStepParams : props.setStepParams

        switch (name) {
            case 'parameters':
                return <ParameterModal
                    type={showStepParams ? showStepParams : props.paramType}
                    commonResult={props.commonResult}
                    params={myParams}
                    setParams={mySetParams}
                    intCol={props.intCol}
                    stepId={props.stepId}
                    experimentDetails={props.experimentDetails}
                    handleOk={handleParamsOk}
                    handleCancel={handleCancel}
                    resType={props.resType}
                ></ParameterModal>
            case 'download-zip':
                return <DownloadZipModal
                    stepId={props.stepId}
                    type={props.type}
                    setStartDownload={setStartDownload}
                    startDownload={startDownload}
                    tableNr={props.tableNr}
                    hasPlot={props.hasPlot}
                    hasImputed={props.hasImputed}
                    handleCancel={handleCancel}
                    handleOk={() => setStartDownload(true)}
                ></DownloadZipModal>
            default:
                return null
        }
    }

    const closeMenu = () => {
        props.setMenuIsVisible(false)
        props.setShowMenuItem(undefined)
        setOpenMenuKeys([])
    }

    const getType = () => {
        if (props.type) {
            return props.type.charAt(0).toUpperCase() + props.type.slice(1)
        } else {
            return "Initial result"
        }
    }

    const getPrepareParamsFunction = (type) => {
        if (type === "t-test") {
            return () => (params) => prepareTTestParams(params)
        } else return undefined
    }

    const clickAddStep = function (type) {
        setTimeout(() => {
            closeMenu()
        }, 300);
        setShowStepParams(type)
        setPrepareParams(getPrepareParamsFunction(type))
        setShowModalName('parameters')
    }

    const onOpenChange = (e) => {
        setOpenMenuKeys(e)
    }

    const followingStepTitle = <span>Add a following step &nbsp;<em style={{color: "silver"}}>Shift A</em></span>

    return (
        <div ref={menuRef} align={"center"} className={"analysis-menu"} style={{minWidth: '200px'}}>
            <div><span className={"analysis-menu-title"}>{getType()} menu</span><Button
                className={"analysis-menu-close"}
                onClick={() => closeMenu()}
                type={"text"}
                icon={<CloseOutlined/>}></Button>
            </div>
            <Menu
                  onClick={() => closeMenu()}
                  style={{minWidth: "250px"}}
                  onOpenChange={onOpenChange}
                  //openKeys={(!openMenuKeys) ? undefined : openMenuKeys}
                  openKeys={openMenuKeys}
                >
                {props.type && <Menu.Item disabled={props.isLocked} onClick={() => setShowModalName('parameters')}
                                          key={'params'}
                >
                    <span>Change parameters..</span>
                </Menu.Item>}
                <Menu.SubMenu key={"add-step"} title={followingStepTitle} disabled={props.isLocked}>
                    <Menu.SubMenu key={"columns"} title={"Columns"}>
                        <Menu.Item onClick={() => clickAddStep("remove-columns")}
                                   className="narrow-menu"
                                   key={'remove-columns'}>
                            <span id={"menu-item"}>Remove columns</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("order-columns")}
                                   className="narrow-menu"
                                   key={'order-columns'}>
                            <span id={"menu-item"}>Order columns</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("rename-columns")}
                                   className="narrow-menu"
                                   key={'rename-columns'}>
                            <span id={"menu-item"}>Rename headers</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("add-column")}
                                   className="narrow-menu"
                                   key={'add-column'}>
                            <span id={"menu-item"}>Add a column</span>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key={"filters"} title={"Filter"}>
                        <Menu.Item onClick={() => clickAddStep("filter")}
                                   className="narrow-menu"
                                   key={'filter'}>
                            <span id={"menu-item"}>Filter rows</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("group-filter")}
                                   className="narrow-menu"
                                   key={'group-filter'}>
                            <span id={"menu-item"}>Filter on valid</span>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key={"sub-2"} title={"Transform"}>
                        <Menu.Item onClick={() => clickAddStep("log-transformation")}
                                   className="narrow-menu"
                                   key={'log-transformation'}>
                            <span id={"menu-item"}>Log transformation</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("normalization")}
                                   className="narrow-menu"
                                   key={'normalization'}>
                            <span id={"menu-item"}>Normalization</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("imputation")}
                                   className="narrow-menu"
                                   key={'imputation'}>
                            <span id={"menu-item"}>Imputation</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("remove-imputed")}
                                   className="narrow-menu"
                                   key={'remove-imputed'}>
                            <span id={"menu-item"}>Remove imputed values</span>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key={"sub-3"} title={"Plots"}>
                        <Menu.Item onClick={() => clickAddStep("scatter-plot")}
                                   className="narrow-menu"
                                   key={'scatter-plot'}>
                            <span id={"menu-item"}>Scatter plot</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("boxplot")}
                                   className="narrow-menu"
                                   key={'boxplot'}>
                            <span id={"menu-item"}>Boxplot</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("pca")}
                                   className="narrow-menu"
                                   key={'pca'}>
                            <span id={"menu-item"}>PCA</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("volcano-plot")}
                                   className="narrow-menu"
                                   key={'volcano-plot'}>
                            <span id={"menu-item"}>Volcano plot</span>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key={"sub-4"} title={"Statistics"}>
                        <Menu.Item onClick={() => clickAddStep("summary-stat")}
                                   className="narrow-menu"
                                   key={'summary-stat'}>
                            <span id={"menu-item"}>Summary</span>
                        </Menu.Item>
                        <Menu.Item onClick={() => clickAddStep("t-test")}
                                   className="narrow-menu"
                                   key={'t-test'}>
                            <span id={"menu-item"}>t Test</span>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Divider key={'divider-2'}></Menu.Divider>
                </Menu.SubMenu>
                {(props.type === 'boxplot' ||
                        props.type === 'volcano-plot' ||
                        props.type === 'pca' ||
                        props.type === 'scatter-plot') &&
                    <Menu.Item onClick={() => setShowModalName('download-zip')}
                               key={'zip'}
                    >
                        <span>Download ZIP..</span>
                    </Menu.Item>}
                <Menu.Divider key={'divider-3'}></Menu.Divider>
                {props.type && <Menu.Item key={'delete-analysis'} danger={true} disabled={props.isLocked}>
                    <Popconfirm
                        title={"Are you sure you want to delete this " + getType() + "?"}
                        onConfirm={() => confirmDelete()}
                        okText="Yes"
                        cancelText="Cancel"
                    >
                        <span>Delete {getType()}</span>
                    </Popconfirm>
                </Menu.Item>}
            </Menu>

            {showModalName && showModal(showModalName, newStepParams)}

        </div>


    )
        ;
}
