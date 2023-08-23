import React from "react";
import {Modal, Spin} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {setIdle} from './loadingSlice'

export default function LoadingInfo() {

    const loading = useSelector(state => state.loading)

    const dispatch = useDispatch();
    
    const cancelModal = () => {
        dispatch(setIdle())
    }

    return (
       <>
           {loading.status === "loading" && <span><Spin /> <strong>{loading.text}</strong></span>}
           {loading.error && <Modal
               open={loading.status === "error"}
               title={loading.error.title}
               footer={null}
               onCancel={() => cancelModal()}
           >
               <p>{loading.error.text}</p>
           </Modal>}
       </>
    );
}
