import React, { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import styles from '../../../styles/styles';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from 'react-icons/ai';
import { backend_url, server } from '../../../server';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/cart';
import useWishlist from '../../../hooks/wishlist'; // Import the wishlist hook
import { toast } from 'react-toastify';
import useGetProducts from '../../../hooks/getProducts';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms/user';
import { sellerState } from '../../../recoil/atoms/seller';

const ProductDetailsCard = ({ setOpen, data }) => {
    const { addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); 
    const imageProduct = `${backend_url}/${data.images[0]}`;
    const imageShop = `${backend_url}/${data.shop.avatar}`;
    const [count, setCount] = useState(1);
    const {products} = useGetProducts(data.shopId);
    const navigate = useNavigate();
    const user = useRecoilValue(userState);

    // Check if item is already in wishlist
    const isInWishlist = wishlist.some((item) => item._id === data._id);

    const handleMessageSubmit = async () => {
        if (user.isAuthenticated) {
          const groupTitle = data._id + user._id;
          const userId = user._id;
          const sellerId = data.shop.shopId;
          await axios.post(`${server}/conversation/create-new-conversation`, {
              groupTitle,
              userId,
              sellerId,
            })
            .then((res) => {
                navigate(`/inbox?${res.data.conversation._id}`);
            })
            .catch((error) => {
              toast.error(error.response.data.message);
            });
        } else {
          toast.error("Login to send messages");
        }
      };
    

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const incrementCount = () => {
        setCount(count + 1);
    };

    const addToCartHandler = () => {
        if (data.stock < count) {
            toast.error('Product stock is limited!');
        } else {
            const productWithQuantity = { ...data, quantity: count };
            addToCart(productWithQuantity);
        }
    };

    const toggleWishlist = () => {
        if (isInWishlist) {
            removeFromWishlist(data._id);
            toast.info('Removed from wishlist');
        } else {
            addToWishlist(data);
            toast.success('Added to wishlist');
        }
    };
    const totalReviewsLength = products && products.reduce((acc, product) => acc + product.reviews.length, 0);
    const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0 ), 0)
    const averageRating = totalRatings / totalReviewsLength || 0;


    return (
        <div className='bg-[#070505]'>
            {data ? (
                <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
                    <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
                        <RxCross1 size={30} className='absolute right-3 top-3 z-58' onClick={() => setOpen(false)} />
                        <div className="block w-full 800px:flex">
                            <div className="w-full 800px:w-[50%]">
                                <img src={imageProduct} alt="" />
                                <div className="flex">
                                    <Link to={`/shop/preview/${data.shopId}`} className='flex'>
                                        <img src={imageShop} className="w-[50px] h-[50px] rounded-full mr-2 mt-2" alt="" />
                                        <div>
                                            <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                                            <h5 className='pb-3 text-[15px]'>
                                                ({averageRating}) Ratings
                                            </h5>
                                        </div>
                                    </Link>
                                </div>
                                <div className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`} onClick={handleMessageSubmit}>
                                    <span className='text-[#fff] flex items-center'> Send Message<AiOutlineMessage className='ml-1' /></span>
                                </div>
                                <h5 className='text-[16px] text-[red] mt-5'>
                                    ({data.sold_out}) Sold out
                                </h5>
                            </div>
                            <div className="w-full 800px:w-[50%] pl-[5px] pr-[5px] ml-2">
                                <h1 className={`${styles.productTitle} text-[20px]`}>
                                    {data.name}
                                </h1>
                                <p>
                                    {data.description}
                                </p>
                                <div className="flex pt-3">
                                    <h4 className={`${styles.productDiscountPrice}`}>
                                        {data.discountPrice}$
                                    </h4>
                                    <h3 className={`${styles.price}`}>
                                        {data.originalPrice ? data.originalPrice + "$" : null}
                                    </h3>
                                </div>
                                <div className="flex items-center mt-12 justify-between pr-3">
                                    <div>
                                        <button className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out" onClick={decrementCount}>
                                            -
                                        </button>
                                        <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[10px]">
                                            {count}
                                        </span>
                                        <button className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out" onClick={incrementCount}>
                                            +
                                        </button>
                                    </div>
                                    <div>
                                        {isInWishlist ? (
                                            <AiFillHeart size={22} className='cursor-pointer' onClick={toggleWishlist} color="red" title='Remove from wishlist' />
                                        ) : (
                                            <AiOutlineHeart size={22} className='cursor-pointer' onClick={toggleWishlist} color="#333" title='Add to wishlist' />
                                        )}
                                    </div>
                                </div>
                                <div className={`${styles.button} mt- rounded-[4px] h-11 flex items-center`} onClick={addToCartHandler}>
                                    <span className='text-[#fff] flex items-center'>Add to cart <AiOutlineShoppingCart className='ml-1' /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ProductDetailsCard;
