import { useContext, useEffect } from 'react';
import LayoutDashboard from '../../components/LayoutDashboard';
import { navLinkitems } from '../../libs/passion';
import TrxCard from '../../components/TrxCard'
import {
    Box,
    Text,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { AppContext } from '../../libs/app'

interface Item {
    id: number,
    namaProduk: string,
    timestamps: string,
    nilaiTransaksi: string,
    metodePembayaran: string,
    tujuanTransaksi: string,
    status: string
}


export default function Page() {
    let data: Item[] = [];

    const router = useRouter();
    const { getPassionData } = useContext(AppContext);
    const passionData = getPassionData();

    for (let i = 0; i < passionData.historiTransaksi.historiTransaksiHistory.length; i++) {
        data.push({
            id: i,
            namaProduk: passionData.historiTransaksi.historiTransaksiHistory[i].namaProduk,
            timestamps: passionData.historiTransaksi.historiTransaksiHistory[i].eventTimestamp,
            nilaiTransaksi: passionData.historiTransaksi.historiTransaksiHistory[i].nilaiTransaksi,
            metodePembayaran: null,
            tujuanTransaksi: null,
            status: passionData.historiTransaksi.historiTransaksiHistory[i].statusTransaksi
        });
    }

    useEffect(() => {
        if (!passionData.Profile.hasOwnProperty('nama')) {
            router.push('/outlet');
        }
    }, []);

    return (
        <Box p='4'>
            <Box borderBottom='3px solid #009923' mb='5'>
                <Text fontSize='1.2rem' fontWeight='bold'>Riwayat Transaksi</Text>
            </Box>
            {data.length > 0 && 
            <TrxCard data={data} />
            }

            {data.length == 0 &&
            <Alert status='info'>
                <AlertIcon />
                <AlertDescription>Belum ada data</AlertDescription>
            </Alert>
            }
        </Box>
    )
}


Page.getLayout = function getLayout(page) {
    return (
        <LayoutDashboard linkItems={navLinkitems}>
            {page}
        </LayoutDashboard>
    )
}
