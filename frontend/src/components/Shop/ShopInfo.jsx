import React, { useEffect, useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { sellerState } from '../../recoil/atoms/seller';
import { backend_url, server } from '../../server';
import styles from '../../styles/styles';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import useGetProducts from '../../hooks/getProducts';
import Loader from '../Layout/Loader';

const ShopInfo = ({ isOwner }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const { products } = useGetProducts(id);
  const totalReviewsLength = products && products.reduce((acc, product) => acc + product.reviews.length, 0);
  const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0 ), 0)
  const averageRating = totalRatings / totalReviewsLength || 0;

  const sellerData = useRecoilValue(sellerState);

  const memoizedSellerData = useMemo(() => {
    return {
      avatar: sellerData.avatar,
      name: sellerData.name,
      description: sellerData.description,
      address: sellerData.address,
      phoneNumber: sellerData.phoneNumber,
      createdAt: sellerData.createdAt,
    };
  }, [sellerData]);

  useEffect(() => {
    const fetchShopInfo = async () => {
      if (isOwner) {
        setData(memoizedSellerData);
        setIsLoading(false);
      } else if (id) {
        try {
          const response = await axios.get(`${server}/shop/get-shop-info/${id}`);
          setData(response.data.shop);
        } catch (error) {
          console.error('Error fetching shop info:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchShopInfo();
  }, [isOwner, id, memoizedSellerData]);

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="w-full py-5">
        <div className="w-full flex items-center justify-center">
          <img src={`${backend_url}${data.avatar}`} alt="Shop Avatar" className="w-[150px] h-[150px] object-cover rounded-full" />
        </div>
        <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
        <p className='text-[16px] text-[#000000a6] p-[10px] flex items-center'>{data.description}</p>
      </div>
      <div className="p-3">
        <h5 className='font-[600]'>Address</h5>
        <h4 className='text-[#000000a6]'>{data.address}</h4>
      </div>
      <div className="p-3">
        <h5 className='font-[600]'>Phone Number</h5>
        <h4 className='text-[#000000a6]'>{data.phoneNumber}</h4>
      </div>
      <div className="p-3">
        <h5 className='font-[600]'>Total Products</h5>
        <h4 className='text-[#000000a6]'>{products?.length || 0}</h4>
      </div>
      <div className="p-3">
        <h5 className='font-[600]'>Shop Ratings</h5>
        <h4 className='text-[#000000a6]'>{averageRating}/5</h4>
      </div>
      <div className="p-3">
        <h5 className='font-[600]'>Joined On</h5>
        <h4 className='text-[#000000a6]'>{new Date(data.createdAt).toLocaleDateString()}</h4>
      </div>
      {isOwner && (
        <div className="py-3 px-4">
            <Link to='/settings'>
            <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
            <span className='text-white'>Edit Shop</span>
          </div>
            </Link>
          <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`} onClick={logoutHandler}>
            <span className='text-white'>Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;
