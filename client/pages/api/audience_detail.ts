import { apiAixpV2 } from "../../libs/api";

export default async function handler(req, res) {

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your specific origin if needed
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow necessary methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow necessary headers

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // Respond with 204 for preflight
  }
  
  const nik = req.query?.id;
  if (!nik) {
    res.status(422).json({
      status: 422,
      message: "Parameter `id` is required",
    });
  }

  try {
    const dataNasabah =
      "nama|namaLengkap|alamatKtp|alamatSesuaiKtp|tanggalLahir|tempatLahir|alamatDomisili|phoneNumber|email|jumlahKreditBJDPL|nilaiCltv";
    const detailAudience =
      "nik|pekerjaan|totalPemasukan|statusPerkawinan|jumlahAnak";
    const detailProduk =
      "daftarNamaProdukBerlangsung|jumlahTotalTransaksi|kolektibilitas|totalOmset|predictValueInvestasi|predictValueAngsuran|predictValueNonAngsuran";
    const detailSegment =
      "segmenMikro|nbaProdukUpsell|nbaProdukXsell|nbaCampaignPromosi|nbaCampaignChannel|nbaKomunikasi|nbaTouchpointTopik|nbaTouchpointChannel|rekomendasiUpsell|rekomendasiXsell|rating";
    const detailCabang = "kodeOutlet|namaOutlet";
    const dataCampaign =
      "namaCampaign|deskripsiCampaign|channelCampaign|waktuKirim";

    
    const fetchWithFallback = async (apiCall) => {
        try {
          const response = await apiCall;
          return response;
        } catch (error) {
          return { data: [], error };
        }
    };

    const [basic, trx, pengajuan, complaints, camp, add] = await Promise.all([
      fetchWithFallback(
      apiAixpV2.get(`/audiences/${nik}`, {
        params: {
          attributes: [
            dataNasabah,
            detailAudience,
            dataCampaign,
            detailCabang,
            detailProduk,
            detailSegment,
          ].join("|"),
          eventList:
            "historiTransaksi,10,0|submitEskalasiTierDua,10,0|aixpOpenEmailCampaign",
        },
      })),
      fetchWithFallback(apiAixpV2.get("/event/historiTransaksi", {
        params: {
          attributes: "nik|email|age",
          audienceId: nik,
          greaterThan: "2022-03-12 20:34:00",
        },
      })),
      fetchWithFallback(
      apiAixpV2.get("/event/pengajuan", {
        params: {
          attributes: "nik|email|age",
          audienceId: nik,
          greaterThan: "2022-03-12 20:34:00",
        },
      })),
      fetchWithFallback(
      apiAixpV2.get("/event/complaintTiket", {
        params: {
          attributes: "nik|email|age",
          audienceId: nik,
          greaterThan: "2022-03-12 20:34:00",
        },
      })),
      fetchWithFallback(
      apiAixpV2.get(`/audience-campaign/${nik}`, {
        params: {
          attributes: "nik|email|age",
          audienceId: nik,
          greaterThan: "2022-03-12 20:34:00",
        },
      })),
      fetchWithFallback(
      apiAixpV2.get("/event/additionalEvent", {
        params: {
          attributes: "nik|email|age",
          audienceId: nik,
          greaterThan: "2022-03-12 20:34:00",
        },
      })),
    ]);

    console.log("basic",basic)
    if (basic?.data?.Identity?.nik?.length) {
      basic.data["historiTransaksi"] = {
        historiTransaksiHistory: trx.data.list,
      };

      basic.data["pengajuan"] = {
        pengajuanHistory: pengajuan.data.list,
      };

      basic.data["submitEskalasiKeLevelDua"] = {
        submitEskalasiKeLevelDuaHistory: complaints.data.list,
      };

      basic.data["historiCampaign"] = {
        historiCampaignList: camp.data.list,
      };

      console.log("camp",camp)
      basic.data["rekomedasiCampaign"] = {
        rekomedasiCampaignList: add.data.list,
      };

      res.status(200).json(basic.data);
    } else {
      res.status(404).json({
        error: 1,
        status: 404,
        message: "Audience Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    res
      .status(e.response?.status || 500)
      .send({ error: 1, message: e.message });
  }
}
