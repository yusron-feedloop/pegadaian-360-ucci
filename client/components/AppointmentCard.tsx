import {
    Box,
    Text,
    Flex,
    Stack
} from '@chakra-ui/react'
import { FiClock } from 'react-icons/fi';
import { FaMapMarkerAlt } from 'react-icons/fa'
import { dateTime } from '../libs/date-time'

const AppointmentCard = ({data}) => {
    return data.map((row) => {
        return (
            <Box position='relative' mb='8' key={row.id}>
                <Flex p='4' bgColor='lightblue' borderRadius='5'>
                    <Box p='4' bgColor='white' borderRadius='5' me='10'>
                        <Stack alignItems='center'>
                            <Text fontWeight='bold' fontSize='5xl' lineHeight='10'>{dateTime(row.reservasiTanggal).format('D')}</Text>
                            <Text>{dateTime(row.reservasiTanggal).format('MMM')}</Text>
                        </Stack>
                    </Box>
                    <Box flex='1'>
                        <Stack mb='2'>
                            <Flex alignItems='center'>
                                <Box me='3'>
                                    <FaMapMarkerAlt />
                                </Box>
                                <Text fontWeight='bold'>{row.namaOutlet}</Text>
                            </Flex>
                        </Stack>
                        <Stack mb='2'>
                            <Flex alignItems='center'>
                                <Box me='3'>
                                    <FiClock />
                                </Box>
                                <Text>{dateTime(row.reservasiWaktuAwal).format('HH:mm')} - {dateTime(row.reservasiWaktuAkhir).format('HH:mm')}</Text>
                            </Flex>
                        </Stack>
                        <Stack>
                            <Text>{row.tujuanTransaksi ?? 'Tujuan Appointment'}</Text>
                        </Stack>
                    </Box>
                </Flex>
                <Box position='absolute' top='5' right='5'>
                    <Text fontWeight='bold' color='#06526b'>
                        via {row.channel}
                    </Text>
                </Box>
            </Box>
        )
    });
}

export default AppointmentCard;