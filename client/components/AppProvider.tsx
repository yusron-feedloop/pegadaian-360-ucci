import * as React from 'react';
import { AppContext } from '../libs/app';

const AppProvider: React.FC = ({children}) => {
    const [passion, setPassion] = React.useState({
        "default": {}, 
        "Work": {},
        "Profile": {},
        "Geography": {},
        "Transaction": {},
        "Identity": {},
        "Lifestyle and life stages": {},
        "Behavior": {},
        "Analytics": {},
        "Outlet": {},
        "historiTransaksi": { historiTransaksiHistory: [] },
        "pengajuan": { pengajuanHistory: [] },
        "submitEskalasiKeLevelDua": { submitEskalasiKeLevelDuaHistory: [] },
        "Financial": {}
    });

    function setPassionData(data) {
        setPassion(data);
    }

    function getPassionData() {
        return passion;
    }

    return (
        <AppContext.Provider value={{setPassionData, getPassionData}}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;