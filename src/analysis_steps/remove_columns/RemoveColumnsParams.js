import React, {useEffect, useState} from "react";
import {Tree, Tag} from 'antd';

export default function RemoveColumnsParams(props) {

    const [checkedKeys, setCheckedKeys] = useState();

    const removeSingle = ["Protein.IDs", "Peptide.counts.all", "Peptide.counts.razor.unique", "Peptide.counts.unique",
        "Number.of.proteins" , "Unique.peptides", "Sequence.coverage", "Unique.razor.sequence.coverage",
        "Unique.sequence.coverage", "Sequence.length", "Sequence.lengths", "Q.value", "id","Peptide.IDs","Peptide.is.razor",
        "Mod..peptide.IDs", "Evidence.IDs", "MS.MS.IDs", "Best.MS.MS", "Oxidation.M.site.IDs", "Oxidation.M.site.positions",
        "Taxonomy.IDs", "Mod.peptide.IDs"];
    const removeSamples = ["Razor.unique.peptides", "Unique.peptides", "Sequence.coverage"];
    const removeWildcard = ["Fraction", "Mutated", "Mutation"]

    const getDefaultCheckedKeys = () => {
        return props.commonResult.headers.map( (a, i) => {
            const hasWildcard = removeWildcard.find( v => a.name.includes(v))
            if(hasWildcard) return undefined

            if(a.type === "EXPERIMENT"){
                return (removeSamples.includes(a.name)) ? undefined : i
            }else{
                return (removeSingle.includes(a.name)) ? undefined : i
            }
        }).filter(a => typeof a !== "undefined")
    }


    useEffect(() => {
        if(!checkedKeys) {
            if (props.params) {
                setCheckedKeys(props.params.keepIdxs)
            } else {
                const defSel = getDefaultCheckedKeys()
                setCheckedKeys(defSel)
                props.setParams({keepIdxs: checkedToParams(defSel)})
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, checkedKeys])

    const treeData = props.commonResult.headers.reduce((acc, val) => {
        const newVal =   {
            title: val.name,
            key: val.idx,
            type: val.type
        }

        if(val.experiment){
            const treeIdx = acc.findIndex( a => a.key === val.experiment.field)
            if(treeIdx < 0){
                acc.push({title: val.experiment.field, key: val.experiment.field, type: 'EXPERIMENT', children: [newVal]})
            }else{
                acc[treeIdx] = {...acc[treeIdx], children: acc[treeIdx].children.concat(newVal)}
            }
        }else{
            acc.push(newVal)
        }

        return acc
    }, [])

    const getTag = (type) => {
        if(type === "NUMBER"){
            return <Tag color={"green"}>Numerical</Tag>
        }else if(type === "CHARACTER"){
            return <Tag color={"gold"}>Character</Tag>
        }else if(type === "EXPERIMENT"){
            return null
        }else{
            return null
        }

    }

    const renderTitle = item => {
      return <div key={item.key}><span>{item.title}&nbsp;&nbsp;&nbsp;{getTag(item.type)}</span></div>
    }

    const checkedToParams = (checkedKeys) => {
        return checkedKeys.filter((a) => {return ! isNaN(a)})
    }

    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
        props.setParams({keepIdxs: checkedToParams(checkedKeysValue)})
    };

    return (
        <>
            <h3>Only keep selected columns</h3>
            <Tree
                checkable
                treeData={treeData}
                titleRender={renderTitle}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
            />

        </>
    );
}
