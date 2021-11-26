import { useEffect, useState } from 'react';
import { getBillNumber } from '@/pages/InBill/services';

const useBillNumber = (type: string) => {
  const [billNumber, setBillNumber] = useState('')
  useEffect(() => {
    getBillNumber({type: type}).then((res) => {
      setBillNumber(() => {
        return res.data
      });
    })
  }, [])
  return billNumber
}

export default useBillNumber
