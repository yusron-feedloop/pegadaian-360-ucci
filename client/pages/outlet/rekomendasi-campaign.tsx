import { useContext, useEffect } from "react";
import LayoutDashboard from "../../components/LayoutDashboard";
import { navLinkitems } from "../../libs/passion";
import CampaignCard from "../../components/CampaignCard";
import AltCampaignCard from "../../components/AltCampaignCard";
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
}

export default function Page() {
  let data: Item[] = [];

  const router = useRouter();
  const { getPassionData } = useContext(AppContext);
  const passionData = getPassionData();

  for (
    let i = 0;
    i < passionData.rekomedasiCampaign?.rekomedasiCampaignList?.length;
    i++
  ) {
    let data_camp = passionData.rekomedasiCampaign.rekomedasiCampaignList[i];
    data.push({
      id: i,
      name: data_camp.additionalSatu,
      body: data_camp.additionalLima,
      sent_by: data_camp.additionalEmpat,
      campaign_start_at: data_camp.additionalDua,
      campaign_end_at: data_camp.additionalTujuh,
      sent_at: data_camp.additionalTiga,
      conversion_type: data_camp.additionalEnam,
    });
  }

  return (
    <Box p="4">
      <Box borderBottom="3px solid #009923" mb="5">
        <Text fontSize="1.2rem" fontWeight="bold">
          Rekomendasi Campaign
        </Text>
      </Box>
      {data.length > 0 && <AltCampaignCard data={data} />}

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
