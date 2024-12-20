import { Box, Text, Flex } from "@chakra-ui/react";
import { dateTime } from "../libs/date-time";
import CustomBadge from "../components/CustomBadge";
import { isCampaignRunning } from "../libs/passion";

const AltCampaignCard = ({ data }) => {
  return data.map((row) => {
    let isActive = isCampaignRunning(
      row.campaign_start_at,
      row.campaign_end_at
    );

    return (
      <Box
        mb="8"
        key={row.id}
        bgColor={isActive ? "lightblue" : "#dadada"}
        py="5"
        borderRadius="5"
      >
        <Flex>
          <Box borderRight="1px solid #aaa" w="300px" textAlign="center">
            <CustomBadge
              color={isActive ? "yellow" : "gray"}
              text={'Total Taksiran'}
            />
            <Text>
               Old : {row.sent_at} | New : {row.sent_by}
            </Text>
          </Box>
          <Box flex="1" ps="5" position="relative">
            <Text fontWeight="bold" noOfLines={[2, 2, 3]} maxWidth={320}>
              No Kredit : {row.name}
            </Text>
            <Text mt="5">Up : {row.body} | Up Max: {row.conversion_type} | Up Mt Cicil : {row.campaign_end_at} </Text>
            <Box position="absolute" right="5" top="0">
              <CustomBadge
                color={isActive ? "blue" : "gray"}
                text={dateTime(row.campaign_start_at).format("DD MMM YYYY")}
              />
            </Box>
          </Box>
        </Flex>
      </Box>
    );
  });
};

export default AltCampaignCard;
