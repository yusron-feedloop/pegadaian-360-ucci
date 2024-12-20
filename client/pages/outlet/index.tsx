import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import LayoutDashboard from "../../components/LayoutDashboard";
import { useRouter } from "next/router";
import * as React from "react";
import { AppContext } from "../../libs/app";
import { searchAudience, searchAudienceByProp } from "../../libs/passion";
import { FaTimesCircle } from "react-icons/fa";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [nik, setNik] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("");
  const [audienceNotFound, setAuidenceNotFound] = React.useState(false);
  const { setPassionData } = React.useContext(AppContext);

  React.useEffect(() => {
    setAuidenceNotFound(false);
  }, [nik, name, phone]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setAuidenceNotFound(false);

    if (nik.length > 0) {
      getAudienceDetail(nik);
    } else if (phone.length > 0) {
      searchAudienceByProp("phone", phone).then((response) => {
        if (response.hasOwnProperty("error")) {
          setAuidenceNotFound(true);
          setLoading(false);
        } else {
          if (response.audiences.length > 0) {
            getAudienceDetail(response.audiences[0].identifier);
          }
        }
      });
    } else if (name.length > 0) {
      searchAudienceByProp("name", name).then((response) => {
        // console.log(response.status); // response.status = undefined

        console.log(response);
        if (response.hasOwnProperty("error")) {
          setAuidenceNotFound(true);
          setLoading(false);
        } else {
          if (response.audiences.length > 0) {
            getAudienceDetail(response.audiences[0].identifier);
          }
        }
      });
    }
  };

  const formatAndSetPhone = (phoneNumber) => {
    phoneNumber = phoneNumber.replace(/^\+62/, "0").replace(/[^0-9]/g, "");
    setPhone(phoneNumber);
  };

  const getAudienceDetail = (_nik) => {
    searchAudience(_nik)
      .then((response) => {
        if (response.hasOwnProperty("error")) {
          setAuidenceNotFound(true);
          setLoading(false);
        } else {
          setPassionData(response);
          router.push("/outlet/data-nasabah");
        }
      })
      .catch((error) => {
        setAuidenceNotFound(true);
        setLoading(false);
      });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <form onSubmit={handleFormSubmit}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack align={"center"}>
              <Heading fontSize={"4xl"}>Informasi C360</Heading>
              <Text fontSize={"md"} color={"gray.600"}>
                Silakan masukkan informasi berikut untuk melihat detail
                informasi nasabah
              </Text>
            </Stack>

            <Stack spacing={4} marginTop="6">
              <FormControl id="nik">
                <FormLabel>NIK</FormLabel>
                <InputGroup>
                  <Input
                    disabled={loading}
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    color={audienceNotFound ? "#f00" : "#000"}
                  />
                  {audienceNotFound && nik.length > 0 && (
                    <InputRightElement>
                      <FaTimesCircle color="#f00" />
                    </InputRightElement>
                  )}
                </InputGroup>
                <Text fontSize={"sm"} color={"gray.400"}>
                  Sebaiknya pencarian menggunakan NIK
                </Text>
              </FormControl>
              <FormControl id="phone">
                <FormLabel>No. HP</FormLabel>
                <InputGroup>
                  <Input
                    disabled={loading}
                    type="text"
                    value={phone}
                    onChange={(e) => formatAndSetPhone(e.target.value)}
                    color={audienceNotFound ? "#f00" : "#000"}
                  />
                  {audienceNotFound && phone.length > 0 && (
                    <InputRightElement>
                      <FaTimesCircle color="#f00" />
                    </InputRightElement>
                  )}
                </InputGroup>
                <Text fontSize={"sm"} color={"gray.400"}>
                  Wajib isi jika NIK / Nama Lengkap kosong
                </Text>
              </FormControl>
              <FormControl id="name">
                <FormLabel>Nama Lengkap</FormLabel>
                <InputGroup>
                  <Input
                    disabled={loading}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    color={audienceNotFound ? "#f00" : "#000"}
                  />
                  {audienceNotFound && name.length > 0 && (
                    <InputRightElement>
                      <FaTimesCircle color="#f00" />
                    </InputRightElement>
                  )}
                </InputGroup>
                <Text fontSize={"sm"} color={"gray.400"}>
                  Wajib isi jika NIK / No. HP kosong
                </Text>
              </FormControl>
              <Stack spacing={10}>
                <Button
                  isLoading={loading}
                  disabled={
                    !(
                      (nik.length > 0 || name.length > 0 || phone.length > 0) &&
                      audienceNotFound == false
                    )
                  }
                  type="submit"
                  bg={"cyan.600"}
                  color={"white"}
                  _hover={{
                    bg: "cyan.700",
                  }}
                >
                  Cari
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  );
}

Page.getLayout = function getLayout(page) {
  return (
    <LayoutDashboard hideSidebar={true} linkItems={[]}>
      {page}
    </LayoutDashboard>
  );
};
