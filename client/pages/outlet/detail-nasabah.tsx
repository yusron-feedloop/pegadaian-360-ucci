import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutDashboard from "../../components/LayoutDashboard";
import { navLinkitems } from "../../libs/passion";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { AppContext } from "../../libs/app";
import { dateTime } from "../../libs/date-time";
import { joinStringArray } from "../../libs/passion";

export default function Page() {
  const router = useRouter();
  const { getPassionData } = useContext(AppContext);
  const passionData = getPassionData();

  useEffect(() => {
    if (!passionData.Profile.hasOwnProperty("nama")) {
      router.push("/outlet");
    }
  }, []);

  const detailNasabah = {
    "Data Nasabah": {
      NIK: passionData?.Identity?.nik,
      Pekerjaan: passionData?.Work?.pekerjaan,
      Pendapatan:
        "Rp. " +
        Number(passionData?.Financial?.totalPemasukan).toLocaleString("id-ID", {
          useGrouping: true,
        }),
      "Status Pernikahan":
        passionData["Lifestyle and life stages"]?.statusPerkawinan,
      "Jumlah Anak":
        passionData["Lifestyle and life stages"]?.jumlahAnak ?? "-",
    },
    Produk: {
      "Produk Aktif": joinStringArray(
        passionData?.Transaction?.daftarNamaProdukBerlangsung,
        ","
      ),
      "Jumlah Transaksi": passionData?.Transaction?.jumlahTotalTransaksi,
      Kolektibilitas: passionData?.Behavior?.kolektibilitas,
      "Total Omset yang Dihasilkan":
        "Rp. " +
        Number(passionData?.Transaction?.totalOmset).toLocaleString("id-ID", {
          useGrouping: true,
        }),
      // 'Perkiraan Jumlah Investasi':
      //   'Rp. ' +
      //   Number(
      //     passionData?.Analytics?.predictValueInvestasi
      //   ).toLocaleString('id-ID', { useGrouping: true }),
      // 'Perkiraan Jumlah Angsuran':
      //   'Rp. ' +
      //   Number(
      //     passionData?.Analytics?.predictValueAngsuran
      //   ).toLocaleString('id-ID', { useGrouping: true }),
      // 'Perkiraan Jumlah Non-Angsuran':
      //   'Rp. ' +
      //   Number(
      //     passionData?.Analytics?.predictValueNonAngsuran
      //   ).toLocaleString('id-ID', { useGrouping: true }),
      "Nilai CLTV":
        "Rp. " +
          Number(passionData?.Analytics?.nilaiCltv).toLocaleString("id-ID", {
            useGrouping: true,
          }) ?? "-",
    },
    Outlet: {
      "Kode Outlet Terdaftar": passionData?.Outlet?.kodeOutlet,
      "Nama Outlet Terdaftar": passionData?.Outlet?.namaOutlet,
    },
    "Rekomendasi Nasabah": {
      "Segmentasi Nasabah": passionData?.Analytics?.segmenMikro,
      "Rekomendasi Produk - Upsell":
        passionData?.Analytics?.nbaProdukUpsell ??
        passionData?.Analytics?.rekomendasiUpsell,
      "Rekomendasi Produk - Xsell":
        passionData?.Analytics?.nbaProdukXsell ??
        passionData?.Analytics?.rekomendasiXsell,
      "Rekomendasi Campaign - Promosi":
        passionData?.Analytics?.nbaCampaignPromosi,
      "Rekomendasi Campaign - Channel":
        passionData?.Analytics?.nbaCampaignChannel,
      "Rekomendasi Komunikasi": passionData?.Analytics?.nbaKomunikasi,
      "Rekomendasi Touchpoint - Topik":
        passionData?.Analytics?.nbaTouchpointTopik,
      "Rekomendasi Touchpoint - Channel":
        passionData?.Analytics?.nbaTouchpointChannel,
    },
  };

  return (
    <Box p="4">
      {Object.keys(detailNasabah).map((key, index) => (
        <Box
          key={`detailNasabah-${index}`}
          borderBottom="3px solid #009923"
          mb="5"
        >
          <Text fontSize="1.2rem" fontWeight="bold">
            {key}
          </Text>
          <Stack px="10" py="4">
            {Object.keys(detailNasabah[key]).map((key2, index2) => (
              <PageItem
                key={`detailNasabah-${index}-${index2}`}
                label={key2}
                data={detailNasabah[key][key2]}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

Page.getLayout = function getLayout(page) {
  return <LayoutDashboard linkItems={navLinkitems}>{page}</LayoutDashboard>;
};

const PageItem = (props: any) => {
  return (
    <Flex key={props.key} borderBottom="1px solid #999" mb="2" pb="2">
      <Text fontWeight="bold">{props.label}</Text>
      <Text flex="1" textAlign="end">
        {props.data}
      </Text>
    </Flex>
  );
};
