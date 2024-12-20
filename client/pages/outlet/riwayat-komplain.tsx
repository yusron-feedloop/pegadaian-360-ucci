import {useContext, useEffect} from 'react';
import LayoutDashboard from '../../components/LayoutDashboard';
import { navLinkitems } from '../../libs/passion';
import ComplaintCard from '../../components/ComplaintCard'
import { Box,
    Text, 
    Alert,
    AlertIcon,
    AlertDescription 
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { AppContext } from '../../libs/app'

interface Item {
    id: number,
    deskripsiTiket: string,
    tiketId: string,
    channelTiket: string,
    namaUser: string,
    tanggalEskalasiTiket: string,
    statusTiket: string,
    sumberTiket: string
}

/**
 * EVENT: submitEskalasiKeLevelDua | submitEskalasiKeLevelTiga
 */

export default function Page(){
    let data: Item[] = [];

    const router = useRouter();
    const { getPassionData } = useContext(AppContext);
    const passionData = getPassionData();

    for (let i = 0; i < passionData.submitEskalasiKeLevelDua.submitEskalasiKeLevelDuaHistory.length; i++) {
        data.push({
            id: i,
            deskripsiTiket: passionData.submitEskalasiKeLevelDua.submitEskalasiKeLevelDuaHistory[i].deskripsiTiket,
            tiketId: passionData.submitEskalasiKeLevelDua.submitEskalasiKeLevelDuaHistory[i].tiketId,
            channelTiket: passionData.submitEskalasiKeLevelDua.submitEskalasiKeLevelDuaHistory[i].channelTiket,
            namaUser: passionData.submitEskalasiKeLevelDua.submitEskalasiKeLevelDuaHistory[i].namaUser,
            tanggalEskalasiTiket: passionData.submitEskalasiKeLevelDua.submitEskalasiKeLevelDuaHistory[i].tanggalEskalasiTiket,
            statusTiket: passionData.submitEskalasiKeLevelDua.submitEskalasiKeLevelDuaHistory[i].statusTiket,
            sumberTiket: passionData.submitEskalasiKeLevelDua.submitEskalasiKeLevelDuaHistory[i].sumberTiket,
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
                <Text fontSize='1.2rem' fontWeight='bold'>Riwayat Komplain</Text>
            </Box>
            {data.length > 0 && 
            <ComplaintCard data={data} />
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
