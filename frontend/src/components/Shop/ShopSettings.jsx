import React, { useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sellerState } from '../../recoil/atoms/seller';
import { backend_url, server } from '../../server';
import { AiOutlineCamera } from 'react-icons/ai';
import styles from '../../styles/styles';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShopSettings = () => {
    const seller = useRecoilValue(sellerState);
    const [avatar, setAvatar] = useState();
    const setSeller = useSetRecoilState(sellerState);
    const [name, setName] = useState(seller && seller.name);
    const [description, setDescription] = useState(seller && seller.description ? seller.description : "");
    const [address, setAddress] = useState(seller && seller.address);
    const [zipCode, setZipCode] = useState(seller && seller.phoneNumber);
    const [phoneNumber, setPhoneNumber] = useState(seller && seller.zipCode);


    const handleImage = async (e) => {
        e.preventDefault()
        const file = e.target.files[0];
        setAvatar(file);

        const formData = new FormData();

        formData.append("image", e.target.files[0]);

        await axios.put(`${server}/shop/update-shop-avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        }).then((res) => {
            setSeller((prevSeller) => ({
                ...prevSeller,
                avatar: res.data.shop.avatar,
            }));
            toast.success('Avatar updated successfully!');
        }).catch((error) => {
            toast.error(error.response.data.message);
        })

    }

    const updateHandler = (e) => {
        e.preventDefault();

        axios.put(`${server}/shop/update-shop-info`, {
            name,
            description,
            address,
            zipCode,
            phoneNumber,
        }, { withCredentials: true }).then((res) => {
            toast.success("Shop Info Updated Successfully!!");
            setSeller((prevSeller) => ({
                ...prevSeller,
                name: res.data.shop.avatar,
                description: res.data.shop.description,
                address: res.data.shop.address,
                zipCode: res.data.shop.zipCode,
                phoneNumber: res.data.shop.phoneNumber,
            }));
        })
    }

    return (
        <div className='w-full min-h-screen flex flex-col items-center my-5'>
            <div className="flex w-full 800px:w-[80%] flex-col justify-center">
                <div className="w-ful flex items-center justify-center">
                    <div className="relative">
                        <img src={avatar ? URL.createObjectURL(avatar) : `${backend_url}/${seller.avatar}`}
                            alt=""
                            className='w-[200px] h-[200px] rounded-full cursor-pointer'
                        />
                        <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
                            <input type="file" id='image' className='hidden' onChange={handleImage} />
                            <label htmlFor='image'>
                                <AiOutlineCamera />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Shop Info */}
                <form aria-aria-required={true} className='flex flex-col items-center' onSubmit={updateHandler}>
                    <div className="w-[100%] 800px:w-[50%] flex items-center flex-col mt-5">
                        <div className="w-full pl-5">
                            <label className='block pb-2'>Shop Name</label>
                        </div>
                        <input
                            type='name'
                            placeholder={`${seller.name}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                        />
                    </div>
                    <div className="w-[100%] 800px:w-[50%] flex items-center flex-col mt-5">
                        <div className="w-full pl-5">
                            <label className='block pb-2'>Shop Description</label>
                        </div>
                        <input
                            type='name'
                            placeholder={`${seller.description ? seller.description : "Enter your shop description"}`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                        />
                    </div>
                    <div className="w-[100%] 800px:w-[50%] flex items-center flex-col mt-5">
                        <div className="w-full pl-5">
                            <label className='block pb-2'>Shop Address</label>
                        </div>
                        <input
                            type='name'
                            placeholder={`${seller.address}`}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                        />
                    </div>
                    <div className="w-[100%] 800px:w-[50%] flex items-center flex-col mt-5">
                        <div className="w-full pl-5">
                            <label className='block pb-2'>Shop ZipCode</label>
                        </div>
                        <input
                            type='name'
                            placeholder={`${seller.zipCode}`}
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                        />
                    </div>
                    <div className="w-[100%] 800px:w-[50%] flex items-center flex-col mt-5">
                        <div className="w-full pl-5">
                            <label className='block pb-2'>Shop Phone Number</label>
                        </div>
                        <input
                            type='number'
                            placeholder={`${seller.phoneNumber}`}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                        />
                    </div>
                    <div className="w-[100%] 800px:w-[50%] flex items-center flex-col mt-5">
                        <input
                            type="submit"
                            value="Update Shop"
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0 cursor-pointer bg-[#70d4eb] 
                                    hover:bg-[#4bb1c7] hover:shadow-lg active:scale-95 transition-all duration-300 ease-in-out 
                                    focus:outline-none focus:ring-2 focus:ring-[#70d4eb] focus:ring-offset-2`}
                            required
                            readOnly
                        />
                    </div>


                </form>
            </div>
        </div>
    )
}

export default ShopSettings