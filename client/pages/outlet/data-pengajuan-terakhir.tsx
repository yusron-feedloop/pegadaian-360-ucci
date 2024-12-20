import { useContext, useEffect } from "react";
import LayoutDashboard from "../../components/LayoutDashboard";
import { navLinkitems } from "../../libs/passion";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AppContext } from "../../libs/app";
import { dateTime } from "../../libs/date-time";

function removeSpecialCharacters(inputString) {
  // Define a regular expression pattern to match all special characters
  const pattern = /[^a-zA-Z0-9 ]/g;

  // Use the replace method to replace all matched characters with an empty string
  const cleanString = inputString.replace(pattern, "");

  return cleanString;
}

export default function Page() {
  const router = useRouter();
  const { getPassionData } = useContext(AppContext);
  const passionData = getPassionData();
  const pengajuan = passionData.pengajuan.pengajuanHistory;
  const trx = passionData.historiTransaksi.historiTransaksiHistory;

  useEffect(() => {
    if (!passionData.Profile.hasOwnProperty("nama")) {
      router.push("/outlet");
    }
  }, []);

  if (pengajuan.length == 0) {
    return <Box p="4">Belum ada data</Box>;
  }

  const parseDate = (date: string) => {
    console.log(date, "date");
    if (!date) {
      return "-";
    } else {
      const newDate = new Date(date);
      return newDate.getFullYear();
    }
  };

  const data = {
    "Reservasi Outlet": passionData.Outlet.namaOutlet,
    "Tanggal Reservasi": dateTime(pengajuan[0].reservasiTanggal).format(
      "DD MMMM YYYY"
    ),
    "Waktu Reservasi":
      "Pk. " +
      dateTime(pengajuan[0].reservasiWaktuAwal).format("HH:mm") +
      " - " +
      dateTime(pengajuan[0].reservasiWaktuAkhir).format("HH:mm"),
    "Tanggal Pengajuan": dateTime(pengajuan[0].reservasiAktivitas).format(
      "DD MMMM YYYY"
    ),
    "Nama BPO": pengajuan[0].namaSales,
    "NIK Nasabah": passionData.Identity.nik,
    "Nama Lengkap": passionData.Profile.namaLengkap,
    "Tanggal Lahir": dateTime(passionData.Profile.tanggalLahir).format(
      "DD MMMM YYYY"
    ),
    "No. Handphone": passionData.Identity.phoneNumber,
    "Nominal Transaksi":
      "Rp. " + trx[0]?.nilaiTransaksi
        ? trx[0]
            ?.nilaiTransaksiNumber(trx[0]?.nilaiTransaksi)
            .toLocaleString("id-ID", {
              useGrouping: true,
            })
        : "-",
    Produk: trx[0]?.namaProduk,
    "Barang Gadai": {
      "Jenis Barang": removeSpecialCharacters(pengajuan[0].jaminanRubrik),
      "Jaminan Kepemilikan": removeSpecialCharacters(
        pengajuan[0].jaminanKepemilikan
      ),
      "Tahun Pembelian": parseDate(pengajuan[0].jaminanTahunPerakitan),
      Kondisi: removeSpecialCharacters(pengajuan[0].jaminanKondisi),
    },
    Pinjaman:
      "Rp. " +
      Number(pengajuan[0].nominalPinjaman).toLocaleString("id-ID", {
        useGrouping: true,
      }),
  };

  return (
    <Box p="4">
      {Object.keys(data).map((key, index) => (
        <Stack px="1" py="1" key={key}>
          {typeof data[key] == "string" ? (
            <PageItem label={key} data={data[key]} />
          ) : (
            <>
              <Text fontWeight="bold">{key}</Text>
              <Box pl={6}>
                {data[key] &&
                  Object.keys(data[key]).map((key2, index2) => (
                    <PageItem
                      key={`detailNasabah-${index}-${index2}`}
                      label={key2}
                      data={data[key][key2]}
                    />
                  ))}
              </Box>
            </>
          )}
        </Stack>
      ))}
    </Box>
  );
}

Page.getLayout = function getLayout(page) {
  return <LayoutDashboard linkItems={navLinkitems}>{page}</LayoutDashboard>;
};

const PageItem = (props: any) => {
  return (
    <Flex key={props.key} borderBottom="1px solid #999" px="1" py="1">
      <Text fontWeight="bold">{props.label}</Text>
      <Text flex="1" textAlign="end">
        {props.data == "null" ? "-" : props.data}
      </Text>
    </Flex>
  );
};
