import { useContext, useEffect } from 'react';
import LayoutDashboard from '../../components/LayoutDashboard';
import { navLinkitems } from '../../libs/passion';
import AppointmentCard from '../../components/AppointmentCard';
import {
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AppContext } from '../../libs/app';

interface Item {
  id: number;
  channel: string; // undefined in data mapping, yet.
  namaOutlet: string;
  reservasiTanggal: string;
  reservasiWaktuAwal: string;
  reservasiWaktuAkhir: string;
  tujuanTransaksi: string; // undefined in data mapping, yet.
}

export default function Page() {
  let data: Item[] = [];

  const router = useRouter();
  const { getPassionData } = useContext(AppContext);
  const passionData = getPassionData();

  for (
    let i = 0;
    i < passionData.pengajuan.pengajuanHistory.length;
    i++
  ) {
    data.push({
      id: i,
      channel: 'nabila',
      namaOutlet: passionData.Outlet.namaOutlet,
      reservasiTanggal:
        passionData.pengajuan.pengajuanHistory[i].reservasiTanggal,
      reservasiWaktuAwal:
        passionData.pengajuan.pengajuanHistory[i].reservasiWaktuAwal,
      reservasiWaktuAkhir:
        passionData.pengajuan.pengajuanHistory[i].reservasiWaktuAwal,
      tujuanTransaksi: null,
    });
  }

  useEffect(() => {
    if (!passionData.Profile.hasOwnProperty('nama')) {
      router.push('/outlet');
    }
  }, []);

  return (
    <Box p="4">
      <Box borderBottom="3px solid #009923" mb="5">
        <Text fontSize="1.2rem" fontWeight="bold">
          Riwayat Appointment
        </Text>
      </Box>
      {data.length > 0 && <AppointmentCard data={data} />}

      {data.length == 0 && (
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>Belum ada data</AlertDescription>
        </Alert>
      )}
    </Box>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <LayoutDashboard linkItems={navLinkitems}>{page}</LayoutDashboard>
  );
};
