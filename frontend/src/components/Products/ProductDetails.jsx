import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from 'react-icons/ai';
import styles from '../../styles/styles';
import { backend_url, server } from '../../server';
import Loader from '../Layout/Loader';
import useGetProducts from '../../hooks/getProducts';
import { useCart } from '../../hooks/cart';
import useWishlist from '../../hooks/wishlist';
import { toast } from 'react-toastify';
import Ratings from './Ratings';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/user';
import axios from 'axios';


const ProductDetails = ({ data }) => {
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false); // For wishlist
    const [select, setSelect] = useState(0);
    
    const navigate = useNavigate();
    const { addToCart } = useCart(); 
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(); 
    const {products} = useGetProducts(data.shopId);
    const user = useRecoilValue(userState);
    // Check if item is already in wishlist
    const isInWishlist = wishlist.some((item) => item._id === data._id);
    
    const incrementCount = () => setCount(count + 1);
    const decrementCount = () => count > 1 && setCount(count - 1);
    const handleMessageSubmit = async () => {
        if (user.isAuthenticated) {
          const groupTitle = data._id + user._id;
          const userId = user._id;
          const sellerId = data.shopId;
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
        } else {
            addToWishlist(data);
        }
        setClick(!click);
    };

    const totalReviewsLength = products && products.reduce((acc, product) => acc + product.reviews.length, 0);
    const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0 ), 0)
    const averageRating = totalRatings / totalReviewsLength || 0;

    return (
        <div className='bg-white'>
            {data ? (
                <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
                    <div className="w-full py-5">
                        <div className="block w-full 800px:flex">
                            <div className="800px:w-[70%] flex flex-col items-center ">
                                <img src={`${backend_url}/${data.images[select]}`} alt="" className='w-[30%]  800px:w-[50%] h-[300px] 800px:h-[400px] mt-5' />
                                <div className="w-full flex justify-center  overflow-x-auto p-10">
                                    {data.images.map((image, index) => (
                                        <div key={index} className={`${select === index ? "border-2 border-blue-950" : ""} cursor-pointer px-2 mt-10`}>
                                            <img
                                                src={`${backend_url}/${image}`} 
                                                alt=""
                                                className=' h-[60px] 800px:h-[130px] mr-3 mt-3'
                                                onClick={() => setSelect(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full 800px:w-[50%] pt-5">
                                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                                <p>{data.description}</p>
                                <div className="flex pt-3">
                                    <h4 className={`${styles.productDiscountPrice}`}>{data.discountPrice}$</h4>
                                    {data.originalPrice && <h3 className={`${styles.price}`}>{data.originalPrice}$</h3>}
                                </div>
                                <div className="flex items-center mt-12 justify-between pr-3">
                                    <div>
                                        <button className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out" onClick={decrementCount}>-</button>
                                        <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[10px]">{count}</span>
                                        <button className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out" onClick={incrementCount}>+</button>
                                    </div>
                                    <div>
                                        {isInWishlist ? (
                                            <AiFillHeart size={22} className='cursor-pointer' onClick={toggleWishlist} color="red" title='Remove from wishlist' />
                                        ) : (
                                            <AiOutlineHeart size={22} className='cursor-pointer' onClick={toggleWishlist} color="#333" title='Add to wishlist' />
                                        )}
                                    </div>
                                </div>
                                <div className={`${styles.button} mt-6 !rounded h-11 flex items-center`} onClick={addToCartHandler}>
                                    <span className='text-white flex items-center'>Add to cart <AiOutlineShoppingCart className='ml-1' /></span>
                                </div>
                                <div className="flex items-center pt-8">
                                    <img src={`${backend_url}/${data?.shop?.avatar}`} alt="" className='w-[50px] h-[50px] rounded-full mr-2' />
                                    <div className='pr-8'>
                                        <h3 className={`${styles.shop_name} pb-1 pt-1}`}>{data.shop.name}</h3>
                                        <h5 className='pb-3 text-[15px]'>({averageRating}/5) Ratings</h5>
                                    </div>
                                    <div className={`${styles.button} bg-[#2e07ad] mt-4 !rounded !h-11`} onClick={handleMessageSubmit}>
                                        <span className='text-white flex items-center'>Send Message <AiOutlineMessage className='ml-1' /></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProductDetailsInfo data={data} totalReviewsLength={totalReviewsLength} products= {products} averageRating= {averageRating}/>
                    <br />
                    <br />
                </div>
            ) : <div><Loader/></div>}
        </div>
    );
};

const ProductDetailsInfo = ({ data, totalReviewsLength , products, averageRating}) => {
    const [active, setActive] = useState(1);
   
    return (
        <div className='bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded'>
            <div className="w-full flex justify-between border-b pt-10 pb-2">
                <div className="relative">
                    <h5 className='text-[#000] text-[13px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]' onClick={() => setActive(1)}>Product Details</h5>
                    {active === 1 && <div className={`${styles.active_indicator}`}></div>}
                </div>
                <div className="relative">
                    <h5 className='text-[#000] text-[13px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]' onClick={() => setActive(2)}>Product Reviews</h5>
                    {active === 2 && <div className={`${styles.active_indicator}`}></div>}
                </div>
                <div className="relative">
                    <h5 className='text-[#000] text-[13px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]' onClick={() => setActive(3)}>Seller Information</h5>
                    {active === 3 && <div className={`${styles.active_indicator}`}></div>}
                </div>
            </div>
            {active === 1 ? (
                <>
                    <p className=' text-[12px] py-2 800px:text-[18px] leading-8 pb-10 whitespace-pre-line'>{data.description}</p>
                </>
            ) : (null)}
            {active === 2 ? (
                <div className='w-full py-3 min-h-[40vh] flex flex-col items-center overflow-y-scroll'>
                   {
                    data && data.reviews.map((item, index)=>(
                        <div className="w-full flex my-2">
                            <img src={`${backend_url}/${item.user.avatar}`} alt="" className='w-[50px] h-[50px] rounded-full' />
                            <div className='pl-2'>
                            <div className="w-full flex items-center">
                                <h1 className='font-[500] mr-3'>{item.user.name}</h1>
                                <Ratings rating={item?.rating}/>
                            </div>
                            <p>{item.comment}</p>
                            </div>
                        </div>
                    ))
                   }
                   <div className="w-full flex justify-center">
                   {
                    data && data.reviews.length === 0 &&(
                        <h5>No Reviews yet!!</h5>
                    )
                   }
                   </div>
                </div>
            ):(null)}
            {active === 3 && (
                <div className='w-full block 800px:flex p-5'>
                    <div className='w-full 800px:w-[50%]'>
                        <div className='flex items-center'>
                            <img src={`${backend_url}/${data.shop.avatar}`} alt="" className='w-[50px] h-[50px] rounded-full' />
                            <div className='pl-3'>
                                <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                                <h5 className='pb-2  text-[12px] 800px:text-[15px]'>({averageRating}/5) Ratings</h5>
                            </div>
                        </div>
                        <p className="pt-2 text-[12px] 800px:text-[15px]">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus maiores magnam reiciendis! Tempore, velit nostrum minima molestias consequuntur a facilis error eligendi sapiente delectus maxime explicabo ut autem eius in!</p>
                    </div>
                    <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
                        <div className="text-left">
                            <h5 className="font-[600] text-[12px] 800px:text-[15px]">Joined on: <span className='font-[500]'>{data.shop?.createdAt?.slice(0,10)}</span></h5>
                            <h5 className="font-[600] pt-3 text-[12px] 800px:text-[15px]">Total Products: <span className='font-[500]'>{products.length}</span></h5>
                            <h5 className="font-[600] pt-3 text-[12px] 800px:text-[15px]">Total Reviews: <span className='font-[500]'>{totalReviewsLength}</span></h5>
                            <Link to={`/shop/preview/${data.shopId}`}>
                                <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                                    <h4 className='text-white'>Visit Shop</h4>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
