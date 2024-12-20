import { useContext, useEffect } from "react";
import { FiCheckSquare, FiHome, FiPhoneCall, FiUsers } from "react-icons/fi";
import LayoutDashboard from "../../components/LayoutDashboard";
import { navLinkitems } from "../../libs/passion";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AppContext } from "../../libs/app";
import { dateTime } from "../../libs/date-time";

export default function Page() {
  const router = useRouter();
  const { getPassionData } = useContext(AppContext);
  const passionData = getPassionData();

  useEffect(() => {
    // if (!passionData?.Profile?.nama) { // this will be true when nama is null
    if (!passionData.Profile.hasOwnProperty("nama")) {
      router.push("/outlet");
    }
  }, []);

  if (!passionData?.Profile) {
    return null;
  }

  return (
    <Box p="4">
      <Box borderBottom="3px solid #009923">
        <Text fontSize="1.2rem" fontWeight="bold">
          Profil
        </Text>
      </Box>
      <Stack px="10" py="4">
        <Flex borderBottom="1px solid #999" mb="2" pb="2">
          <Text fontWeight="bold">Nama</Text>
          <Text flex="1" textAlign="end">
            {passionData.Profile.nama || passionData.Profile.namaLengkap}
          </Text>
        </Flex>
        <Flex borderBottom="1px solid #999" mb="2" pb="2">
          <Text fontWeight="bold">Alamat KTP</Text>
          <Text flex="1" textAlign="end">
            {passionData.Geography.alamatKtp}
          </Text>{" "}
          {/* {passionData.Profile.alamatSesuaiKtp} */}
        </Flex>
        <Flex borderBottom="1px solid #999" mb="2" pb="2">
          <Text fontWeight="bold">Tempat &amp; Tanggal Lahir</Text>
          <Text flex="1" textAlign="end" color="#333">
            {dateTime().format("DD MMMM") ==
              dateTime(passionData.Profile.tanggalLahir).format("DD MMMM") && (
              <Box as="span" background="#fffc6b" p="2">
                {passionData.Profile.tempatLahir},{" "}
                {dateTime(passionData.Profile.tanggalLahir).format(
                  "DD MMMM YYYY"
                )}
              </Box>
            )}
            {dateTime().format("DD MMMM") !=
              dateTime(passionData.Profile.tanggalLahir).format("DD MMMM") && (
              <Box as="span">
                {passionData.Profile.tempatLahir},{" "}
                {dateTime(passionData.Profile.tanggalLahir).format(
                  "DD MMMM YYYY"
                )}
              </Box>
            )}
          </Text>
        </Flex>
        <Flex borderBottom="1px solid #999" mb="2" pb="2">
          <Text fontWeight="bold">Umur</Text>
          <Text flex="1" textAlign="end">
            {dateTime().diff(
              dateTime(passionData.Profile.tanggalLahir),
              "year"
            )}
          </Text>
        </Flex>
        <Flex borderBottom="1px solid #999" mb="2" pb="2">
          <Text fontWeight="bold">Alamat Domisili</Text>
          <Text flex="1" textAlign="end">
            {passionData.Geography.alamatDomisili}
          </Text>
        </Flex>
      </Stack>
      <Box borderBottom="3px solid #009923">
        <Text fontSize="1.2rem" fontWeight="bold">
          Kontak
        </Text>
      </Box>
      <Stack px="10" py="4">
        <Flex borderBottom="1px solid #999" mb="2" pb="2">
          <Text fontWeight="bold">No. Handphone</Text>
          <Text flex="1" textAlign="end">
            {passionData.Identity.phoneNumber}
          </Text>
        </Flex>
        <Flex borderBottom="1px solid #999" mb="2" pb="2">
          <Text fontWeight="bold">Email</Text>
          <Text flex="1" textAlign="end">
            {passionData.Identity.email}
          </Text>
        </Flex>
      </Stack>
      <Box borderBottom="3px solid #009923">
        <Text fontSize="1.2rem" fontWeight="bold">
          Portfolio
        </Text>
      </Box>
      <Stack px="10" py="4">
        <Flex borderBottom="1px solid #999" mb="2" pb="2">
          <Text fontWeight="bold">Jumlah Kredit BJDPL</Text>
          <Text flex="1" textAlign="end">
            {passionData.Transaction.jumlahKreditBJDPL}
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
}

Page.getLayout = function getLayout(page) {
  return <LayoutDashboard linkItems={navLinkitems}>{page}</LayoutDashboard>;
};
