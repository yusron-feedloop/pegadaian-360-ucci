import * as React from 'react';
import { FiCheckSquare, FiHome, FiPhoneCall, FiUsers } from 'react-icons/fi';
import LayoutDashboard from '../../components/LayoutDashboard';
import { navLinkitems } from '../../libs/passion';

export default function Page(){
    return (
        <div>
            Data Pengajuan Terakhir
        </div>
    )
}


Page.getLayout = function getLayout(page) {
    return (
    <LayoutDashboard linkItems={navLinkitems}>
        {page}
    </LayoutDashboard>
    )
}