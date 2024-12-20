import { useContext, useEffect } from "react";
import LayoutDashboard from "../../components/LayoutDashboard";
import { navLinkitems } from "../../libs/passion";
import CampaignCard from "../../components/CampaignCard";
import {
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AppContext } from "../../libs/app";

interface Item {
  id: number;
  name: string;
  body: string;
  sent_by: string;
  campaign_start_at: string;
  campaign_end_at: string;
  sent_at: string;
  conversion_type: string;
  seq: number;
}

export default function Page() {
  let data: Item[] = [];

  const router = useRouter();
  const { getPassionData } = useContext(AppContext);
  const passionData = getPassionData();

  for (
    let i = 0;
    i < passionData.historiCampaign?.historiCampaignList?.length;
    i++
  ) {
    let data_camp = passionData.historiCampaign.historiCampaignList[i];
    if (
      ((data_camp.campaignType === "WhatsApp" ||
        data_camp.campaignType === "Email") &&
        (data_camp.conversionType === "sent" ||
          data_camp.conversionType === "read" ||
          data_camp.conversionType === "click")) ||
      ((data_camp.campaignType === "SMS" ||
        data_camp.campaignType === "Push Notification") &&
        data_camp.conversionType === "sent")
    )
      data.push({
        id: passionData.historiCampaign.historiCampaignList[i].campaignId,
        name: passionData.historiCampaign.historiCampaignList[i].campaignName,
        body: passionData.historiCampaign.historiCampaignList[i]
          .campaignDescription,
        sent_by:
          passionData.historiCampaign.historiCampaignList[i].campaignType,
        campaign_start_at:
          passionData.historiCampaign.historiCampaignList[i].executionDate,
        campaign_end_at:
          passionData.historiCampaign.historiCampaignList[i].endDate,
        sent_at:
          passionData.historiCampaign.historiCampaignList[i].executionDate,
        conversion_type:
          passionData.historiCampaign.historiCampaignList[i].conversionType,
        seq:
          data_camp.conversionType === "sent"
            ? 1
            : data_camp.conversionType === "read"
            ? 2
            : 3,
      });
  }
  data.sort(
    (a, b) =>
      a.campaign_start_at.localeCompare(b.campaign_start_at) || a.seq - b.seq
  );

  return (
    <Box p="4">
      <Box borderBottom="3px solid #009923" mb="5">
        <Text fontSize="1.2rem" fontWeight="bold">
          Riwayat Campaign
        </Text>
      </Box>
      {data.length > 0 && <CampaignCard data={data} />}

      {data.length == 0 && (
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>Belum ada data</AlertDescription>
        </Alert>
      )}
    </Box>
  );
}

Page.getLayout = function getLayout(page) {
  return <LayoutDashboard linkItems={navLinkitems}>{page}</LayoutDashboard>;
};
