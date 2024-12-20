export interface InformationData {
    key: string
    values: string[]
}
export interface IInformation {
    title: string
    data: InformationData[]
}
export interface IBankInfo {
    namaBank: string
    nomorRekening: string
    namaPemilikAkunBank: string
}
export interface IRiwayatKomplainData {
    subject: string
    subjectCaseInfo: string
    source: string
    id: string
    channel: string // instagram, twitter, etc
    channelAccount: string // username instagram/twitter/other
    createdAt: string
    agent: string
    status: string
    subKategoriInteraksi: string
    kategoriEskalasi: string
    subKategoriEskalasi: string
    detilKategoriEskalasi: string
    komentarEskalasi: string,
    sentimen: string
    deskripsiTiket: string,
    namaBank: string,
    event: string
}
export interface IApiKomplainResponse {
    history: IRiwayatKomplainData[]
    bank: IBankInfo
}

export interface IRiwayatTransaksiData {
    namaProduk: string
    date: string
    time: string
    nilaiTransaksi: string
    statusTransaksi: string
    id: string
    tujuanTransaksi: string
    metodePembayaran: string
  }

 export interface IApiTransaksiResponse {
    history: IRiwayatTransaksiData[]
    informations: IInformation[]
  }
  

export interface IRiwayatCampaignData {
    name: string
    dateStart: string
    dateEnd: string
    content: string
    type: string // email,whatsapp,etc
    status: string
    dateSent: string
  }

export interface IApiCampaignResponse {
    history: IRiwayatCampaignData[]
}

export interface IApiProfilResponse {
    nik: string
    tanggalLahir: string
    namaIbuKandung: string
    phoneNumber: string
    informations: IInformation[]
}

export interface IApiResponse {
    komplain: IApiKomplainResponse
    profil: IApiProfilResponse
    transaksi: IApiTransaksiResponse
    campaign: IApiCampaignResponse
}
