import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { sellerState } from '../recoil/atoms/seller';
import { server } from '../server';

const useSellerAuth = () => {
  const [seller, setSeller] = useRecoilState(sellerState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seller.isAuthenticated) {
      axios.get(`${server}/shop/getseller`, { withCredentials: true })
        .then((res) => {
          toast.success(res.data.message);
          setSeller({
            isAuthenticated: true,
            avatar: res.data.seller.avatar,
            name: res.data.seller.name,
            email: res.data.seller.email,
            description: res.data.seller.description,
            _id: res.data.seller._id,
            address: res.data.seller.address,
            zipCode: res.data.seller.zipCode,
            phoneNumber: res.data.seller.phoneNumber,
            createdAt: res.data.seller.createdAt,
            availableBalance: res.data.seller.availableBalance,
          });
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || 'An error occurred.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); 
    }
  }, [seller.isAuthenticated, setSeller]);

  return { seller, loading };
};

export default useSellerAuth;
