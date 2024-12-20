export const formatPrice = (value, prefix = '') => {
    const val = value / 1;
    const formattedNum = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (!prefix) return formattedNum;
    return `${prefix} ${formattedNum}`;
  };
