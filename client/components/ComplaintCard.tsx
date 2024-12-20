import {
    Box,
    Text,
    Flex,
    Stack
} from '@chakra-ui/react'
import { FaChartBar, FaDesktop, FaUser, FaRegClock, FaHome} from 'react-icons/fa'
import { dateTime } from '../libs/date-time'

const ComplaintCard = ({data}) => {
    return data.map( row => {
        return (
            <Box bgColor='#ddd' borderRadius='10' mb='8' key={row.id}>
                <Flex p='4' alignItems='center' bgColor='lightblue' borderTopRadius='10'>
                    <Box me='10' minW='200px'>
                        <Flex alignItems='center'>
                            <Box borderRadius='50%' bgColor='#f00' width='20px' height='20px' me='3'>
                                &nbsp;
                        </Box>
                            <Text>{row.deskripsiTiket}</Text>
                        </Flex>
                    </Box>
                    <Box me='10' minW='200px'>
                        <Flex alignItems='center'>
                            <Box me='3'>
                                <FaChartBar />
                            </Box>
                            <Text>{row.tiketId}</Text>
                        </Flex>
                    </Box>
                    <Box minW='200px'>
                        <Flex alignItems='center'>
                            <Box me='3'>
                                <FaDesktop />
                            </Box>
                            <Text>{row.channelTiket}</Text>
                        </Flex>
                    </Box>
                    <Box flex='1'>
                        <Flex alignItems='center' justifyContent='flex-end'>
                            <Box me='3'>
                                <FaUser />
                            </Box>
                            <Text>Agent: {row.namaUser}</Text>
                        </Flex>
                    </Box>
                </Flex>
                <Flex p='4' alignItems='center'>
                    <Box flex='1'>
                        <Flex alignItems='center'>
                            <Box me='3'>
                                <FaRegClock />
                            </Box>
                            <Text>Dibuat: {dateTime(row.tanggalEskalasiTiket).format('DD MMMM YYYY, HH:mm:ss')}</Text>
                        </Flex>
                    </Box>
                    {row.closed_at && 
                        <Box flex='1'>
                            <Flex alignItems='center'>
                                <Box me='3'>
                                    <FaRegClock />
                                </Box>
                            <Text>Ditutup: {dateTime(row.closed_at).format('DD MMMM YYYY, HH:mm:ss')}</Text>
                            </Flex>
                        </Box>
                    }
                </Flex>
                <Flex px='4' pb='4'>
                    <Box me='3'>
                        <FaHome />
                    </Box>
                    <Text>{row.sumberTiket}</Text>
                    <Box flex='1' textAlign='right'>
                        <Text textTransform='capitalize' color={row.status == 'open' ? '#c00':'green'}>
                            {row.statusTiket} (5,1)
                        </Text>
                    </Box>
                </Flex>
            </Box>
        );
    });
}

export default ComplaintCard;