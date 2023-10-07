import React from 'react';

function ModalNovaPendencia() {
    const [modalActive, setModalActive] = useState(false);
    const [newPendencia, setNewPendencia] = useState("");



    return (
        <div className='hidden fixed bg-[#00000080] top-0 left-0 w-full h-full z-1000'>
            <div className='bg-white w-3/4 mt-20 ml-auto mr-auto rounded p-20 shadow-modal'>
            </div>
        </div>
    )
}

export default ModalNovaPendencia