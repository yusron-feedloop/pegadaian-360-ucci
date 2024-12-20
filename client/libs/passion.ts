import {
  FiCheckSquare,
  FiHome,
  FiPhoneCall,
  FiUsers,
} from 'react-icons/fi';
import { LinkItemProps } from '../components/LayoutDashboard';
import { dateTime } from '../libs/date-time';

export const navLinkitems: LinkItemProps[] = [
  {
    name: 'Data pengajuan terakhir',
    icon: FiHome,
    href: '/outlet/data-pengajuan-terakhir',
  },
  {
    name: 'Data Nasabah',
    icon: FiPhoneCall,
    href: '/outlet/data-nasabah',
  },
  {
    name: 'Detail Nasabah',
    icon: FiCheckSquare,
    href: '/outlet/detail-nasabah',
  },
  // {
  //   name: 'Riwayat Appointment',
  //   icon: FiCheckSquare,
  //   href: '/outlet/riwayat-appointment',
  // },
  {
    name: 'Riwayat Komplain',
    icon: FiUsers,
    href: '/outlet/riwayat-komplain',
  },
  {
    name: 'Riwayat Transaksi',
    icon: FiUsers,
    href: '/outlet/riwayat-transaksi',
  },
  {
    name: 'Riwayat Campaign',
    icon: FiUsers,
    href: '/outlet/riwayat-campaign',
  },
  // {
  //   name: 'Daftar Rekomendasi Campaign',
  //   icon: FiUsers,
  //   href: '/outlet/rekomendasi-campaign',
  // },
];

export const isCampaignRunning = (start_date, end_date): boolean => {
  return (
    !end_date ||
    (dateTime(start_date) < dateTime() &&
      dateTime(end_date) > dateTime())
  );
};

export const joinStringArray = (str: string, glue: string) => {
  try {
    const data = JSON.parse(str);
    return data.join(glue);
  } catch (e) {
    return '';
  }
};

export const searchAudienceByProp = async (prop, value) => {
  const client = fetch('/api/audience_list?' + prop + '=' + value, {
    headers: {
      'Content-type': 'application/json',
    },
  });

  return (await client).json();
};

export const searchAudience = async (nik) => {
  const client = fetch('/api/audience_detail?id=' + nik, {
    headers: {
      'Content-type': 'application/json',
    },
  });

  return (await client).json();
};
