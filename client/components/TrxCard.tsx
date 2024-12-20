import { Box, Text, Flex, Badge } from '@chakra-ui/react';
import { FaToolbox } from 'react-icons/fa';
import { dateTime } from '../libs/date-time';

const TrxCard = ({ data }) => {
  const colorMap = {
    success: 'green',
    failed: 'red',
    pending: 'yellow',
  };
  return data.map((row) => {
    return (
      <Box mb="8" key={row.id}>
        <Box
          ms="3"
          px="4"
          py="1"
          bgColor="#06526b"
          display="inline-block"
          borderTopRadius="5"
        >
          <Text color="#fff" fontSize=".8rem">
            {dateTime(row.timestamps).format(
              'DD MMMM YYYY, HH:mm:ss'
            )}
          </Text>
        </Box>
        <Flex
          p="4"
          alignItems="center"
          bgColor="lightblue"
          borderRadius="5"
        >
          <Box flex="1">
            <Flex alignItems="center">
              <Box me="5">
                <FaToolbox size="3em" />
              </Box>
              <Box textAlign="left">
                <Text fontWeight="bold">
                  {row.namaProduk ?? 'Nama Produk'}
                </Text>
                <Text>
                  {row.tujuanTransaksi ?? 'Tujuan Transaksi'}
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box flex="1">
            <Text>Pembayaran via {row.metodePembayaran}</Text>
          </Box>
          <Box flex="1">
            <Text>
              Rp. {parseInt(row.nilaiTransaksi).toLocaleString()}
            </Text>
          </Box>
          <Box flex="1">
            <Badge colorScheme={colorMap[row.status]}>
              {row.status}
            </Badge>
          </Box>
        </Flex>
      </Box>
    );
  });
};

export default TrxCard;
