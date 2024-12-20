import { Box, Text, Flex } from "@chakra-ui/react";
import { dateTime } from "../libs/date-time";
import CustomBadge from "../components/CustomBadge";
import { isCampaignRunning } from "../libs/passion";

const CampaignCard = ({ data }) => {
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
              text={row.conversion_type}
            />
            <Text>
              {dateTime(row.sent_at).format("DD / MM / YYYY")} | via{" "}
              {row.sent_by}
            </Text>
          </Box>
          <Box flex="1" ps="5" position="relative">
            <Text fontWeight="bold" noOfLines={[2, 2, 3]} maxWidth={320}>
              {row.name}
            </Text>
            <Text mt="5">{row.body}</Text>
            <Box position="absolute" right="5" top="0">
              <CustomBadge
                color={isActive ? "blue" : "gray"}
                text={
                  row.campaign_end_at
                    ? dateTime(row.campaign_start_at).format("DD MMM YYYY") +
                      " - " +
                      dateTime(row.campaign_end_at).format("DD MMM YYYY")
                    : dateTime(row.campaign_start_at).format("DD MMM YYYY")
                }
              />
            </Box>
          </Box>
        </Flex>
      </Box>
    );
  });
};

export default CampaignCard;
