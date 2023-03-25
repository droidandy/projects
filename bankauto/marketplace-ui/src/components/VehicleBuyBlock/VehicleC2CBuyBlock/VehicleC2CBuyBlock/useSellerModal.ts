import { useEffect, useState, useRef } from 'react';
import { useSellerInfo } from 'store/catalog/seller';

export const useSellerModal = (vehicleId: number | string) => {
  const [sellerModalOpen, setSellerModalOpen] = useState<boolean>(false);
  const isInitiated = useRef(false);
  const { info: sellerInfo, fetchSellerInfo } = useSellerInfo();

  useEffect(() => {
    if (sellerModalOpen && !isInitiated.current) {
      fetchSellerInfo(vehicleId);
      isInitiated.current = true;
    }
  }, [sellerModalOpen, vehicleId, fetchSellerInfo]);

  const toggleOpenSellerModal = () => {
    setSellerModalOpen(!sellerModalOpen);
  };

  return {
    sellerInfo,
    sellerModalOpen,
    toggleOpenSellerModal,
  };
};
