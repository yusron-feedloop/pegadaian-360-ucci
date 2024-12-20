import { NextApiRequest, NextApiResponse } from "next";
import { dateTime } from "../../../libs/date-time";
import {
  IApiCampaignResponse,
  IApiKomplainResponse,
  IApiProfilResponse,
  IApiResponse,
  IApiTransaksiResponse,
} from "../../../modules/contact-center";
import { apiAixpV2 } from "../../../libs/api";

function getDataKomplain(data: any): IApiKomplainResponse {
  const histories: any[] =
    data?.submitEskalasiTierDua?.submitEskalasiTierDuaHistory || [];
  const historiesCwc: any[] = data?.submitCwc?.submitCwcHistory || [];
  const historiesKeluhan: any[] = data?.inputKeluhan?.inputKeluhanHistory || [];
  const bank = data["Bank Account"];
  const profil = data["Profile"];
  const social = data["Identity"];
  const getChannelAccount = (channel) => {
    switch (channel.toLowerCase()) {
      case "facebook":
        return social.facebookId;
      case "twitter":
        return social.twitterId;
      case "instagram":
        return social.instagramId;
      case "youtube":
        return social.youtubeId;
      case "telegram":
        return social.telegramId;
    }
  };

  const getStatusTiket = (tiketId) => {
    const daftar = data?.daftarKeluhan.daftarKeluhanHistory || [];

    const stat = daftar.filter((d) => d.tiketId == tiketId);
    if (stat.length > 0) {
      return stat[0].statusTiket;
    }

    return "N/A";
  };

  let allHistories = [];

  histories.forEach((mHistory) => {
    allHistories.push({
      source: mHistory.sumberTiket,
      subject: mHistory.jenisKeluhan,
      subjectCaseInfo: mHistory.subjekTiket, // case info
      id: mHistory.tiketId,
      channel: mHistory.channelTiket,
      channelAccount: getChannelAccount(mHistory.channelTiket),
      createdAt: dateTime(mHistory.tanggalEskalasiTiket).format(
        "YYYY-M-DD HH:mm:ss"
      ),
      agent: mHistory.namaUser,
      status: mHistory.statusTiket,
      subKategoriInteraksi: mHistory.subKategoriInteraksi, // case info
      kategoriEskalasi: mHistory.kategoriEskalasi,
      subKategoriEskalasi: mHistory.subKategoriEskalasi,
      detilKategoriEskalasi: mHistory.detilKategoriEskalasi,
      komentarEskalasi: mHistory.komentarEskalasi,
      sentimen: mHistory.sentimen, // case info
      deskripsiTiket: mHistory.deskripsiTiket,
      namaBank: mHistory.bankPembayaran,
      event: "submitEskalasiTierDua",
    });
  });

  historiesKeluhan.forEach((mHistory) => {
    allHistories.push({
      source: mHistory.sumberTiket,
      subject: mHistory.jenisKeluhan,
      id: mHistory.tiketId,
      channel: mHistory.diajukanDi,
      channelAccount: "",
      createdAt: dateTime(mHistory.tanggalEskalasiTiket).format(
        "YYYY-M-DD HH:mm:ss"
      ),
      agent: "",
      status: getStatusTiket(mHistory.tiketId),
      subKategoriEskalasi: "",
      sentimen: "",
      deskripsiTiket: mHistory.deskripsiTiket,
      namaBank: "",
      event: "inputKeluhan",
    });
  });

  historiesCwc.forEach((mHistory) => {
    allHistories.push({
      source: mHistory.sumberTiket,
      subject: mHistory.jenisKeluhan,
      id: mHistory.tiketId,
      channel: mHistory.channelTiket,
      channelAccount: getChannelAccount(mHistory.channelTiket),
      createdAt: dateTime(mHistory.timestamp).format("YYYY-M-DD HH:mm:ss"),
      agent: mHistory.namaUser,
      status: mHistory.statusTiket,
      subKategoriEskalasi: mHistory.subKategoriInteraksi,
      sentimen: mHistory.sentimen,
      deskripsiTiket: mHistory.deskripsiTiket,
      namaBank: mHistory.bankPembayaran,
      event: "submitCwc",
    });
  });

  return {
    bank: {
      namaBank: bank?.namaBank,
      namaPemilikAkunBank: profil?.namaLengkap,
      nomorRekening: bank?.nomorRekening,
    },
    history: allHistories,
  };
}

function getDataProfil(responseJson: any): IApiProfilResponse {
  return {
    nik: responseJson.Identity.nik,
    tanggalLahir: responseJson.Profile.tanggalLahir,
    namaIbuKandung: responseJson.Profile.namaIbuKandung,
    phoneNumber: responseJson.Identity.phoneNumber,
    informations: [
      {
        title: "Data Nasabah",
        data: [
          {
            key: "Nama",
            values: [
              responseJson.Profile.namaLengkap || responseJson.Profile.nama,
            ],
          },
          { key: "Pekerjaan", values: [responseJson.Work.pekerjaan] },
          {
            key: "Tempat & Tanggal Lahir",
            values: [
              `${responseJson.Profile.tempatLahir}, ${dateTime(
                responseJson.Profile.tanggalLahir
              ).format("DD MMMM YYYY")}`,
            ],
          },
          {
            key: "Nomor Handphone",
            values: [responseJson.Identity.phoneNumber],
          },
          { key: "Email", values: [responseJson.Identity.email] },
        ],
      },
      {
        title: "Data Sosial media",
        data: [
          { key: "Twitter", values: [responseJson.Identity.twitterId] },
          { key: "Instagram", values: [responseJson.Identity.instagramId] },
          { key: "Facebook", values: [responseJson.Identity.facebookId] },
        ],
      },
      {
        title: "Outlet",
        data: [
          {
            key: "Kode Cabang Terdaftar",
            values: [responseJson.Outlet.kodeOutlet],
          },
          {
            key: "Nama Cabang Terdaftar",
            values: [responseJson.Outlet.namaOutlet],
          },
        ],
      },
      {
        title: "Rekomendasi Nasabah",
        data: [
          {
            key: "Segmentasi Nasabah",
            values: [responseJson.Analytics.segmenMikro],
          },
          {
            key: "Rekomendasi Produk - Upsell",
            values: [responseJson.Analytics.nbaProdukUpsell],
          },
          {
            key: "Rekomendasi Produk - Xsell",
            values: [responseJson.Analytics.nbaProdukXsell],
          },
          {
            key: "Rekomendasi Campaign - Promosi",
            values: [responseJson.Analytics.nbaCampaignPromosi],
          },
          {
            key: "Rekomendasi Campaign - Channel",
            values: [responseJson.Analytics.nbaCampaignChannel],
          },
          {
            key: "Rekomendasi Komunikasi",
            values: [responseJson.Analytics.nbaKomunikasi],
          },
          {
            key: "Rekomendasi Touchpoint - Topik",
            values: [responseJson.Analytics.nbaTouchpointTopik],
          },
          {
            key: "Rekomendasi Touchpoint - Channel",
            values: [responseJson.Analytics.nbaTouchpointChannel],
          },
        ],
      },
    ],
  };
}

function getDataTransaksi(data: any): IApiTransaksiResponse {
  const histories: any[] =
    data?.historiTransaksi?.historiTransaksiHistory || [];
  const activeProductNames = histories.reduce((result, mHistory) => {
    if (result.includes(mHistory.namaProduk)) {
      return result;
    }
    return [...result, mHistory.namaProduk];
  }, []);

  return {
    informations: [
      {
        title: "Produk Aktif",
        data: [{ key: "", values: [activeProductNames.join(", ")] }],
      },
    ],
    history: histories.map((mHistory) => ({
      id: mHistory.idTransaksi,
      namaProduk: mHistory.namaProduk,
      date: dateTime(mHistory.tanggalTransaksi).format("DD MMMM YYYY"),
      time: dateTime(mHistory.tanggalTransaksi).format("HH.mm"),
      nilaiTransaksi: mHistory.nilaiTransaksi,
      statusTransaksi: mHistory.statusTransaksi,
      tujuanTransaksi: mHistory.tujuanTransaksi,
      metodePembayaran: mHistory.metodePembayaran,
    })),
  };
}

function getDataCampaign(data): IApiCampaignResponse {
  let campaigns: any[] = data || [];
  campaigns = campaigns.filter((camp) => camp.conversionType === "sent");
  return {
    history: campaigns.map((camp) => ({
      id: camp.campaignId,
      name: camp.campaignName,
      dateStart: camp.executionDate,
      dateEnd: camp.endDate ? camp.endDate : null,
      content: camp.campaignDescription,
      type: camp.campaignType,
      status: camp.conversionType,
      dateSent: camp.executionDate,
    })),
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IApiResponse | any>
) {
  const nik = req.query.id;

  try {
    const response = await apiAixpV2.get(`/audiences/${nik}`, {
      params: {
        attributes: process.env.AUDIENCE_ATTRIBUTES,
        eventList:
          "historiTransaksi,10,0|submitEskalasiTierDua,10,0|submitCwc,10,0|inputKeluhan,10,0|daftarKeluhan,10,0",
      },
    });

    const resCamp = await apiAixpV2.get(`/audience-campaign/${nik}`, {
      params: {
        attributes: "nik|email|age",
        audienceId: nik,
        greaterThan: "2022-03-12 20:34:00",
      },
    });

    res.status(200).json({
      komplain: getDataKomplain(response.data),
      profil: getDataProfil(response.data),
      transaksi: getDataTransaksi(response.data),
      campaign: getDataCampaign(resCamp.data?.list),
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error);
      return;
    }
    res.status(500).send({ message: error.message });
  }
}
