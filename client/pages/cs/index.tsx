import { 
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box, 
  BoxProps, 
  Button, 
  Container, 
  CSSObject, 
  Flex, 
  FormControl, 
  FormLabel, 
  Heading, 
  HStack, 
  IconButton, 
  Input, 
  InputGroup, 
  InputRightElement, 
  Stack, 
  Tab, 
  TabList, 
  TabPanel, 
  TabPanels, 
  Tabs, 
  Tag, 
  Text, 
  useColorModeValue, 
  useDisclosure, 
  VStack 
} from '@chakra-ui/react'

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { FC, useEffect, useRef, useState } from 'react'
import { 
  FiCalendar, 
  FiClock, 
  FiFacebook, 
  FiFrown, 
  FiHome, 
  FiInstagram, 
  FiMail, 
  FiPhoneCall, 
  FiTarget, 
  FiTwitter, 
  FiUser, 
  FiVolume2,
  FiRefreshCcw
} from 'react-icons/fi'

import { FaBuilding } from 'react-icons/fa'

import { fetchJson } from '../../libs/fetch'
import {
  IApiCampaignResponse, 
  IApiKomplainResponse, 
  IApiProfilResponse, 
  IApiResponse, 
  IApiTransaksiResponse, 
  IBankInfo, 
  InformationData, 
  IRiwayatCampaignData, 
  IRiwayatKomplainData, 
  IRiwayatTransaksiData, 
} from '../../modules/contact-center'
import { useForm } from 'react-hook-form'
import { dateTime } from '../../libs/date-time'
import { formatPrice } from '../../libs/formatter';



interface IRiwayatKomplainProps extends BoxProps {
  historyData: IRiwayatKomplainData[]
  bank: IBankInfo
}

interface ILayoutProps extends BoxProps {
    history: IRiwayatKomplainData,
    bank: IBankInfo,
    index: number
}

const getChannelIcon = (channel: string) => {
    const channelUppercase = channel.toUpperCase();
    const TransaksiStatusColor = {
        'INSTAGRAM': <FiInstagram />,
        'TWITTER': <FiTwitter />,
        'FACEBOOK': <FiFacebook />,
        'EMAIL': <FiMail />,
        'PHONE': <FiPhoneCall />,
    }
    return TransaksiStatusColor[channelUppercase] || <FiUser />
}

const LayoutNabila: FC<ILayoutProps> = ({ history, bank, index, ...rest }) => {
    return <VStack key={index} mt={4} spacing={2} align={'start'} rounded={'md'} padding={4} bg={'blue.50'} {...rest}>
        <Text fontWeight={'bold'}>{history.subject}</Text>
        <HStack spacing={2} alignItems="flex-start">
            <Box flexGrow={1}>
                <Text fontWeight={'bold'} color={'blue.700'}>{history.source}: {history.id}</Text>
            </Box>
            {
                history.source?.toUpperCase() === 'NABILA' && <Box flexGrow={1}>
                    <Text fontSize='sm'><b>CASE INFO</b></Text>
                    <Text fontSize={'sm'}>
                        <u>Subjek:</u>
                        {history.subjectCaseInfo || '-'}
                    </Text>
                    <Text fontSize={'sm'}>
                        <u>Sub Kategori:</u>
                        {history.subKategoriInteraksi || '-'}
                    </Text>
                    <Text fontSize={'sm'}>
                        <u>Sentimen:</u>
                        {history.sentimen || '-'}
                    </Text>
                </Box>
            }
        </HStack>

        <Box width="100%">
            <Flex minWidth='max-content' alignItems='flex-start'>
                {getChannelIcon(history.channel)}
                <Text fontSize={'sm'} flexGrow={1}>{history.channelAccount}</Text>
                <HStack flexGrow={3}>
                    <FaBuilding size="24" />
                    <Box>
                        <Text fontSize='sm'>
                            {history.namaBank || '-'}
                        </Text>
                        <Text fontSize='sm'>
                            {bank.nomorRekening || '-'}
                        </Text>
                    </Box>
                </HStack>
            </Flex>
        </Box>

        <HStack spacing={2}>
            <FiClock />
            <Box>
                <Text fontSize={'sm'}>Dibuat: {history.createdAt}</Text>
            </Box>
        </HStack>

        <Box>
            <Text fontWeight='bold' fontSize='sm'>ARIANA FORM</Text>
            <Text fontSize='sm'><u>Kategori</u>: {history.kategoriEskalasi}</Text>
            <Text fontSize='sm'><u>Sub Kategori</u>: {history.subKategoriEskalasi}</Text>
            <Text fontSize='sm'><u>Detil Kategori</u>: {history.detilKategoriEskalasi}</Text>
        </Box>
        <Box>
            <Text fontSize='sm'><u>Komentar</u>:</Text>
            <Text fontSize='sm'>{history.komentarEskalasi}</Text>
        </Box>
        <Flex width={'full'} alignItems={'center'} fontWeight={'bold'} color={'blue.700'}>
            <FiUser fontWeight={'bold'} color={'blue.700'} />
            <Text ml={2} flexGrow={1}>Agent: {history.agent}</Text>
            <Text>
                <Tag as={'span'} bg={'transparent'} fontWeight={'bold'} color={'green.400'} textTransform={'uppercase'}>
                    {history.status}
                </Tag>
            </Text>
        </Flex>
    </VStack>
}

const LayoutMonev: FC<ILayoutProps> = ({ history, index, ...rest }) => {
  return <VStack key={index} mt={4} spacing={2} align={'start'} rounded={'md'} padding={4} bg={'blue.50'} {...rest}>
    <HStack spacing={2}>
      <Box flexGrow={1}>
        <Text fontWeight={'bold'}>{history.subject}</Text>
        {/* @ts-ignore */}
        <Text fontWeight={'bold'} color={'blue.700'}>{history.category}: {history.ticket_id}</Text>
      </Box>
    </HStack>

    {/* <HStack spacing={2}>
      <FiHome />
      <Box>
        <Text fontSize={'sm'}>{history.channel}</Text>
      </Box>
    </HStack> */}

    <HStack spacing={2}>
      <FiClock />
      <Box>
        {/* @ts-ignore */}
        <Text fontSize={'sm'}>Dibuat: {new Date(history.ticket_date).toLocaleString()}</Text>
      </Box>
    </HStack>
    <Box>
      <Text fontSize={'sm'} textDecoration={'underline'}>Deksripsi:</Text>
      {/* @ts-ignore */}
      <Text fontSize={'sm'}>{history.remark || '-'}</Text>
    </Box>
    <Flex width={'full'} alignItems={'center'} fontWeight={'bold'} color={'blue.700'}>
      <Box ml={2} flexGrow={1}></Box>
      <Text>
        <Tag as={'span'} bg={'transparent'} fontWeight={'bold'} color={'green.400'} textTransform={'uppercase'}>
          {history.status}
        </Tag>
      </Text>
    </Flex>
  </VStack>
}

const LayoutCwc: FC<ILayoutProps> = ({history, bank, index, ...rest}) => {

    return <VStack key={index} mt={4} spacing={2} align={'start'} rounded={'md'} padding={4} bg={'blue.50'} {...rest}>
        <HStack spacing={2}>
            <Box flexGrow={1}>
                <Text fontWeight={'bold'}>{history.subject}</Text>
                <Text fontWeight={'bold'} color={'blue.700'}>{history.source}: {history.id}</Text>
                <HStack spacing={2}>
                    {getChannelIcon(history.channel)}
                    <Text fontSize={'sm'}>{history.channelAccount}</Text>
                </HStack>
            </Box>
            {
                history.source?.toUpperCase() === 'NABILA' && <Box flexGrow={1}>
                    <Text fontSize={'sm'}>
                        <u>Sub Kategori:</u>
                        {history.subKategoriEskalasi || '-'}
                    </Text>
                    <Text fontSize={'sm'}>
                        <u>Sentimen:</u>
                        {history.sentimen || '-'}
                    </Text>
                </Box>
            }
        </HStack>

        <HStack spacing={2}>
            <FiClock />
            <Box>
                <Text fontSize={'sm'}>Dibuat: {history.createdAt}</Text>
            </Box>
        </HStack>
        <Box>
            <Text fontSize={'sm'} textDecoration={'underline'}>Deksripsi:</Text>
            <Text fontSize={'sm'}>{history.deskripsiTiket || '-'}</Text>
        </Box>
        <Box>
            <Text fontSize={'sm'} textDecoration={'underline'}>Informasi Lanjutan:</Text>
            <Text fontSize={'sm'}>Nama Bank: {history.namaBank || '-'}</Text>
            <Text fontSize={'sm'}>Nama Nasabah Bank: {bank.namaPemilikAkunBank || '-'}</Text>
            <Text fontSize={'sm'}>No rek: {bank.nomorRekening || '-'}</Text>
        </Box>
        <Flex width={'full'} alignItems={'center'} fontWeight={'bold'} color={'blue.700'}>
            <FiUser fontWeight={'bold'} color={'blue.700'} />
            <Text ml={2} flexGrow={1}>Agent: {history.agent}</Text>
            <Text>
                <Tag as={'span'} bg={'transparent'} fontWeight={'bold'} color={'green.400'} textTransform={'uppercase'}>
                    {history.status}
                </Tag>
            </Text>
        </Flex>
    </VStack>
}

const RiwayatKomplainCard: FC<IRiwayatKomplainProps> = ({ historyData, bank, ...rest }) => {
  
  
  return <Box
    rounded={'lg'}
    bg={useColorModeValue('white', 'gray.700')}
    boxShadow={'lg'}
    p={6}
    {...rest}
  >
    <Text fontWeight={'bold'}>Riwayat Komplain</Text>

    {/*  TODO:  */}
    {historyData.map((history, index) => {
        // if (history.event == 'submitEskalasiTierDua') {
        //     return <LayoutNabila history={history} bank={bank} index={index} />
        // }else if(history.event == 'submitCwc'){
        //     return <LayoutCwc history={history} bank={bank} index={index} />
        // }else{
        //     return <LayoutMonev history={history} bank={bank} index={index} />
        // }

        /* @ts-ignore */
        return <LayoutMonev history={history} index={index} key={history.ticket_id} />

    })}
  </Box>
}

interface IInformationCardProps extends BoxProps {
  title: string,
  data: InformationData[]
}
const InformationCard: FC<IInformationCardProps> = ({title: type, data, ...rest}) => (
  <Box
    rounded={'lg'}
    bg={useColorModeValue('white', 'gray.700')}
    boxShadow={'lg'}
    p={4}
    {...rest}
  >
    <Text fontWeight={'bold'}>{type}</Text>
    { data.map((datum, index) => {
        return <VStack key={index} align={'stretch'} fontSize={'sm'} ml={2}>
          <Text fontWeight={'bold'} mt={2}>{datum.key}</Text>
          { datum.values.map((value, index) => (
            <Text key={index} bg={'blue.50'} px={2} minH={2}>{value}</Text>
          )) }
        </VStack>
      })
    }
  </Box>
)


interface IRiwayatTransaksiCardProps extends BoxProps {
  data: IRiwayatTransaksiData[];
}
const RiwayatTransaksiCard: FC<IRiwayatTransaksiCardProps> = ({
  data,
  ...rest
}) => {
  function getStatusColor(status: string) {
    const statusUppercase = status.toUpperCase();
    const TransaksiStatusColor = {
      BERHASIL: "green.400",
      GAGAL: "red.400",
    };
    return TransaksiStatusColor[statusUppercase] || "gray.400";
  }
  
  return (
    <Box
      rounded={"lg"}
      bg={useColorModeValue("white", "gray.700")}
      boxShadow={"lg"}
      p={4}
      {...rest}
    >
      <Text fontWeight={"bold"}>Riwayat Transaksi</Text>
      {data.map((datum, index) => {
        return (
          <HStack
            key={index}
            bg={"blue.50"}
            rounded={"sm"}
            fontSize={"sm"}
            mt={2}
            p={2}
            justify={"space-between"}
          >
            <VStack textAlign={"left"} align={"stretch"}>
              <Text fontWeight={"bold"}>{datum.namaProduk}</Text>
              <Text fontSize={"sm"} mt={0}>
                {datum.date}
                {/* {datum.date} | {datum.time} WIB */}
              </Text>
              {/* <Text fontSize={"sm"} mt={0}>
                {datum.tujuanTransaksi || "-"}
              </Text> */}
            </VStack>
            <VStack textAlign={"right"} align={"stretch"}>
              <Text fontSize={"sm"} fontWeight={"medium"}>
                Nominal
              </Text>
              <Text fontSize={"sm"} mt={0}>
                Rp {formatPrice(datum.nilaiTransaksi)},-
              </Text>
              {/* <Text fontSize={"sm"} mt={0}>
                via {datum.metodePembayaran || "-"}
              </Text> */}
              <Text
                fontWeight={"bold"}
                textTransform={"uppercase"}
                color={getStatusColor(datum.statusTransaksi)}
              >
                {datum.statusTransaksi}
              </Text>
            </VStack>
          </HStack>
        );
      })}
    </Box>
  );
};

interface IRiwayatCampaignCardProps extends BoxProps {
  historyData: IRiwayatCampaignData[]
}
const RiwayatCampaignCard: FC<IRiwayatCampaignCardProps> = ({historyData, ...rest}) => (
  <Box
    rounded={'lg'}
    bg={useColorModeValue('white', 'gray.700')}
    boxShadow={'lg'}
    p={4}
    {...rest}
  >
    <Text fontWeight={'bold'}>Riwayat Transaksi</Text>
    { historyData.map((datum, index) => {
        return <VStack key={index} bg={'blue.50'} rounded={'md'} align={'stretch'} fontSize={'sm'} mt={4} p={2}>
          <Text fontWeight={'bold'}>{datum.name}</Text>
          <Text fontSize={'sm'}>{datum.dateStart} {!!datum.dateEnd && `- ${datum.dateEnd}`}</Text>

          <Text fontSize={'sm'} mt={2}>{datum.content}</Text>
          <Flex mt={2} justify={'space-between'}>
            <Text fontSize={'sm'} as={'em'}>via {datum.type}</Text>
            <Box textAlign={'right'}>
              <Text fontWeight={'bold'} color={'green.400'}>{datum.status}</Text>
              <Text fontWeight={'bold'} color={'green.400'}>{datum.dateSent}</Text>
            </Box>
          </Flex>
        </VStack>
      })
    }
  </Box>
)


interface IProfilVerifyFormProps extends BoxProps {
  onSubmitVerify: Function
  onFormReset:number
  loading: boolean
}
const ProfilVerifyForm: FC<IProfilVerifyFormProps> = ({onSubmitVerify, onFormReset, loading, ...rest}) => {
  const [datePicked, setDatePicked] = useState(null);


  const form = useForm({
    mode: 'onChange',
    defaultValues: {nik: '', tanggalLahir: '', namaIbuKandung: '', phoneNumber: ''}
  })

  const resetForm = () => {
    form.reset()
  }

  function handleFormSubmit(val) {
    onSubmitVerify({
      nik: val.nik, 
      phoneNumber: val.phoneNumber, 
      namaIbuKandung: val.namaIbuKandung, 
      tanggalLahir: val.tanggalLahir,
    })
  }


  useEffect(() => {
    resetForm()
    if (datePicked) {
      form.setValue('tanggalLahir', dateTime(datePicked).format('DD/MM/YY'))
    }
  }, [datePicked,onFormReset])

  return <Box {...rest}>
    <Text fontWeight={'bold'}>Verifikasi Data Nasabah</Text>

    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <Stack spacing={4} marginTop="6" px={4}>
          <FormControl id="nik">
              <FormLabel>NIK</FormLabel>
              <Input 
                disabled={loading} 
                type="text" 
                name="nik"
                placeholder='NIK'
                {...form.register('nik', {required: true, minLength: 16})}
              />
              { form.formState.errors.nik && <Text as={'em'} fontSize={'sm'} color={'red.300'}>Pastikan NIK terdiri dari 16 angka</Text> }

          </FormControl>
          <FormControl>
              <FormLabel>Nomor Handphone</FormLabel>
              <Input 
                disabled={loading} 
                type="text"
                name="phoneNumber"
                placeholder='Nomor Handphone'
                {...form.register('phoneNumber', {minLength: 9})}
              />
              { form.formState.errors.phoneNumber && <Text as={'em'} fontSize={'sm'} color={'red.300'}>Pastikan No HP terdiri dari 10-12 angka</Text> }

          </FormControl>
          <Stack spacing={10}>
            <Button
              isLoading={loading}
              type='submit'
              bg={'blue.500'}
              color={'white'}
              _hover={{
                  bg: 'cyan.700',
              }}>
                Verifikasi 
            </Button>
          </Stack>
        </Stack>
    </form>
  </Box>
}

const styleTabSelected: CSSObject = {
  fontWeight: 'bold',
  color: 'blue.500',
  border: '1px solid',
  borderColor: 'inherit',
  backgroundColor: 'gray.50'
}

export default function ContactCenterPage({query}) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = useRef()
  
  const [tabIndex, setTabIndex] = useState(0)
  const [hasVerifyProfil, setHasVerifyProfil] = useState(false)
  
  const [dataKomplain, setDataKomplain] = useState<IApiKomplainResponse>(null)
  const [dataProfil, setDataProfil] = useState<IApiProfilResponse>(null)
  const [dataTransaksi, setDataTransaksi] = useState<IApiTransaksiResponse>(null)
  const [dataCampaign, setDataCampaign] = useState<IApiCampaignResponse>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reset, setReset] = useState(false)
  const [resetForm, setResetForm] = useState(0)

  const resetData = () => {
      // setDataKomplain(null);
      // setDataProfil(null);
      // setDataTransaksi(null);
      // setDataCampaign(null);
      setReset(false)
      setHasVerifyProfil(false);
      setResetForm(resetForm + 1)
  }
    

  async function fetchData(nik: any, phoneNumber: string): Promise<IApiResponse> {
    try {
      setLoading(true)
      setError(null)
      const resData = await fetchJson<IApiResponse>(`/api/contact-center?id=${nik}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (phoneNumber) {
        const onxTicket = await fetchJson(`/api/onx?phoneNumber=${phoneNumber}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        resData.komplain = onxTicket.data.ticket;
      }

      return resData;
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitVerify({
    nik,
    phoneNumber,
    // namaIbuKandung,
    // tanggalLahir
  }: {nik: string, phoneNumber: string}) {
      try{
          const resData = await fetchData(nik, phoneNumber)
          setDataKomplain(resData.komplain)
          setDataProfil(resData.profil)
          setDataTransaksi(resData.transaksi)
          setDataCampaign(resData.campaign)

          const isValidNik = nik === resData.profil.nik
          // const isValidTanggalLahir = dateTime(tanggalLahir, ['D/M/YYYY', 'D/M/YY']).isSame(resData.profil.tanggalLahir, 'day')
          // const isValidIbuKandung = namaIbuKandung.toUpperCase() === resData.profil.namaIbuKandung.toUpperCase()
          // TODO
          let isValidPhoneNumber = false; 

          if (phoneNumber) {
            let aixpPhoneNumber = resData.profil.phoneNumber.startsWith('0') ? resData.profil.phoneNumber.replace('0', '') : resData.profil.phoneNumber;
            aixpPhoneNumber = resData.profil.phoneNumber.includes('+62') ? resData.profil.phoneNumber.replace('+62', '') : aixpPhoneNumber;

            `62${aixpPhoneNumber}` === phoneNumber ? isValidPhoneNumber = true : isValidPhoneNumber = false;
          }

          const allValidations = [isValidNik, isValidPhoneNumber]

          if (allValidations.every((val) => val === true)) {
              setHasVerifyProfil(true)
              return;
          }

          onOpen();
      }catch(e){
          setHasVerifyProfil(false)
          setDataKomplain(null)
          setDataProfil(null)
          setDataTransaksi(null)
          setDataCampaign(null)
          setReset(true);

          onOpen()
      }
  }
  

  useEffect(() => {
    (async () => {
      if (query.nik) {
        const phoneNumber = query.phoneNumber ? query.phoneNumber : null;
        const resData = await fetchData(query.nik, phoneNumber)
        setDataKomplain(resData.komplain)
        setDataProfil(resData.profil)
        setDataTransaksi(resData.transaksi)
        setDataCampaign(resData.campaign)
      }
    })()
  }, [])

  return (
    <>
      <Tabs isFitted variant='enclosed' colorScheme={'blue'} onChange={(index) => setTabIndex(index)}>
        <Flex
          minH={'100vh'}
          direction={'column'}
          position={'absolute'}
          inset={0}
          flexWrap={'nowrap'}
        >
          <Container maxW={'container.sm'}>
            <Stack mt={4} align={'center'} position="relative">
              <Heading fontSize={'2xl'}>Informasi C360</Heading>
              {(hasVerifyProfil||reset) &&
              <Button as="span" position="absolute" right="0" bgColor="transparent" py="0" style={{marginTop:0, marginRight:-10}} onClick={e => resetData() }>
                <HStack>
                    <FiRefreshCcw />
                      <Text>
                          RESET
                      </Text>
                </HStack>
                </Button>
              }
            </Stack>
            <TabList mt={4} color={'gray.400'}>
              {[
                {name: 'Komplain', icon: FiFrown, isDisabled: false}, 
                {name: 'Profil', icon: FiUser, isDisabled: false}, 
                {name: 'Transaksi', icon: FiTarget, isDisabled: !hasVerifyProfil}, 
                {name: 'Campaign', icon: FiVolume2, isDisabled: !hasVerifyProfil}
              ].map((tab) => (
                <Tab key={tab.name} _selected={styleTabSelected} isDisabled={tab.isDisabled}>
                  <VStack>
                    <tab.icon fontSize={24}/>
                    <Text>{tab.name}</Text>
                  </VStack>
                </Tab>
              ))}
            </TabList>
          </Container>   
          <Box bg={useColorModeValue('gray.50', 'gray.800')} flexGrow={1} overflowY={'auto'}>
            <Container maxW={'container.sm'}>
              {(() => {
                // if (error) {
                //   return error.message;
                // }

                if (!hasVerifyProfil) {
                  return <ProfilVerifyForm loading={loading} onFormReset={resetForm} onSubmitVerify={handleSubmitVerify}/>
                }

                return <TabPanels>
                    <TabPanel px={0}>
                      {loading && 'Loading data...'}
                      {/*  TODO: */}
                      {dataKomplain && 
                        // <RiwayatKomplainCard historyData={dataKomplain.history} bank={dataKomplain.bank} />
                        // @ts-ignore
                        <RiwayatKomplainCard historyData={dataKomplain} />
                      }
                    </TabPanel>
                    <TabPanel >
                      {loading && 'Loading data...'}

                      { dataProfil && 
                        dataProfil.informations.map((information, index) => (
                          <InformationCard
                            key={index}
                            title={information.title}
                            data={information.data}
                            mb={4}
                          />
                        ))
                      }
                    </TabPanel>
                    <TabPanel>
                      {loading && 'Loading data...'}
                      
                      {
                        dataTransaksi && dataTransaksi.informations.map((information) => (
                          <InformationCard
                            key={information.title}
                            title={information.title}
                            data={information.data}
                          />
                        ))
                      }
                      {dataTransaksi && <RiwayatTransaksiCard mt={4} data={dataTransaksi.history}/>}
                    </TabPanel>
                    <TabPanel px={0}>
                      {loading && 'Loading data...'}
                      
                      {/* Sementara dihilangin dulu */}
                      {'Data belum tersedia'}
                      {/* {dataCampaign && 
                        <RiwayatCampaignCard historyData={dataCampaign.history}/>
                      } */}
                    </TabPanel>
                  </TabPanels>
              })()}
            </Container>   
          </Box>
        </Flex>
      </Tabs>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody p={16}>
              <Text align={'center'} fontSize={'lg'} fontWeight={'bold'}>Data tidak ditemukan!</Text>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

ContactCenterPage.getInitialProps = async ({ query }) => {
  return {query}
}
