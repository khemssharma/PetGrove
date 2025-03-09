import React, { useEffect, useState } from 'react';
import { backend_url, server } from '../../server';
import { userState } from '../../recoil/atoms/user';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete } from 'react-icons/ai';
import styles from '../../styles/styles';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { MdOutlineTrackChanges, MdTrackChanges } from 'react-icons/md';
import useUpdateUserInfo from '../../hooks/updateUserInfo';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RxCross1 } from 'react-icons/rx';
import { Country, State, City } from 'country-state-city';
import useUpdateAddress from '../../hooks/updateUserAddress';
import useDeleteAddress from '../../hooks/User/deleteUserAddress';
import useGetAllOrders from '../../hooks/User/getAllOrders';
import Loader from "../../components/Layout/Loader";
import { FaArrowRight } from 'react-icons/fa';


const ProfileContent = ({ active }) => {
    const user = useRecoilValue(userState);
    const setUser = useSetRecoilState(userState);
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const { updateUserInfoHandler, loading } = useUpdateUserInfo();

    useEffect(() => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setPhoneNumber(user?.phoneNumber || '');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = { name, email, phoneNumber, password };
        console.log('Submitting user info:', userInfo); // Debugging line
        try {
            await updateUserInfoHandler(userInfo);
        } catch (error) {
            console.error('Failed to update user info:', error.message);
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        setAvatar(file);

        const formData = new FormData();
        formData.append('image', file);

        await axios.put(`${server}/user/update-avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        }).then((res) => {
            setUser((prevUser) => ({
                ...prevUser,
                avatar: res.data.user.avatar,
            }));
            toast.success('Avatar updated successfully!');
        }).catch((error) => {
            toast.error(error.response.data.message);
        });
    }


    return (
        <div className='w-full'>
            {/* Profile  */}
            {active === 1 && (
                <>
                    <div className="flex justify-center w-full">
                        <div className="relative">
                            <img src={`${backend_url}${user?.avatar}`} alt="" className='w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]' />

                            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                                <input
                                    type="file"
                                    id="image"
                                    className='hidden'
                                    onChange={handleImage}
                                />
                                <label htmlFor="image">
                                    <AiOutlineCamera />
                                </label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="w-full px-5">
                        <form onSubmit={handleSubmit} aria-required={true}>
                            <div className="w-full block 800px:flex pb-3">
                                <div className="w-[100%] 800px:w-[50%]">
                                    <label className='block pb-2'>Full Name</label>
                                    <input type="text" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className="w-[100%] 800px:w-[50%]">
                                    <label className='block pb-2'>Email Address</label>
                                    <input type="text" className={`${styles.input} !w-[95%] mb-1 800px:mb-0`} required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="w-full block 800px:flex pb-3">
                                <div className="w-[100%] 800px:w-[50%]">
                                    <label className='block pb-2'>Phone Number</label>
                                    <input type="text" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                                <div className="w-[100%] 800px:w-[50%]">
                                    <label className='block pb-2'>Enter your password</label>
                                    <input type="password" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <input type="submit" className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`} value="Update" disabled={loading} />
                        </form>
                    </div>
                </>
            )}

            {/* Order */}
            {active === 2 && (
                <div>
                    <AllOrders />
                </div>
            )}

            {/* Refund */}
            {active === 3 && (
                <div>
                    <AllRefundOrders />
                </div>
            )}

            {/* Track Order */}
            {active === 5 && (
                <div>
                    <TrackOrder />
                </div>
            )}

            {/* PaymentMethod */}
            {active === 6 && (
                <div>
                    <ChangePassword />
                </div>
            )}

            {/* User Address */}
            {active === 7 && (
                <div>
                    <Address />
                </div>
            )}
        </div>
    );
}




const AllOrders = () => {
    const { allOrders, loading } = useGetAllOrders();

    if (loading) {
        return <><Loader /></>;
    }

    return (
        <div className="pl-4 pt-1 space-y-4 overflow-y-auto">
            {allOrders.map((order) => (
                <div
                    key={order._id}
                    className="bg-white p-2 border border-gray-200 rounded-md shadow-sm flex items-center justify-between overflow-hidden"
                >
                    {/* Cart Items */}
                    <div className="flex items-center space-x-4">
                        {order.cart.slice(0, 1).map((item, index) => ( // Show only first item
                            <div key={index} className="flex items-center">
                                <img
                                    src={`${backend_url}/${item.images[0]}`}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md cursor-pointer"
                                />
                                <div className="ml-2">
                                    {/* Slice product name for mobile view */}
                                    <p className="text-sm font-medium truncate max-w-[80px] sm:max-w-none sm:whitespace-normal">
                                        {window.innerWidth < 640 ? `${item.name.slice(0, 10)}...` : item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="ml-auto flex flex-col items-end space-y-1">
                        {/* Truncated Order ID */}
                        <h3 className="text-sm font-semibold">
                            Order: #{order._id.slice(0, 8)}...{/* Slice off part of Order ID */}
                        </h3>
                        <p className={`text-xs ${order.status === 'Delivered' ? 'text-green-500' : 'text-orange-500'}`}>
                            {order.status}
                        </p>
                        <p className="text-xs text-gray-600">Total: US$ {order.totalPrice}</p>

                        {/* Action Arrow Icon */}
                        <Link to={`/user/order/${order._id}`} className="mt-1">
                            <FaArrowRight className="text-blue-500 text-lg" />
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};


const AllRefundOrders = () => {
    const { allOrders, loading } = useGetAllOrders();

    // Filter refund orders where the status is "Processing refund"
    const refundOrders = allOrders?.filter((item) => item.status === "Processing refund") || [];

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="pl-8 pt-1">
            {refundOrders.length === 0 ? (
                <p className="text-gray-600">No refund orders found.</p>
            ) : (
                refundOrders.map((order) => (
                    <div
                        key={order._id}
                        className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-md shadow-sm mb-4"
                    >
                        {/* Order Summary Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            {/* Order ID */}
                            <div className="mr-6">
                                <h3 className="text-base font-semibold">
                                    Order: {order._id.slice(0, 10)}...
                                </h3>
                                <p className={`text-sm ${order.status === 'Refund Successfully' ? 'text-green-500' : 'text-orange-500'}`}>
                                    {order.status}
                                </p>
                            </div>
                            {/* Product Details */}
                            <div className="flex items-center">
                                {order.cart && order.cart.length > 0 ? (
                                    <>
                                        {/* Product Image */}
                                        <img
                                            src={`${backend_url}/${order.cart[0].images[0]}`} // Ensure images is available
                                            alt={order.cart[0].name}
                                            className="w-16 h-16 object-cover rounded mr-4"
                                        />
                                        {/* Product Name */}
                                        <p className="text-sm text-gray-600">
                                            {order.cart[0].name.length > 15
                                                ? `${order.cart[0].name.slice(0, 15)}...`
                                                : order.cart[0].name}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-600">No items found</p>
                                )}
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="text-sm text-gray-700">
                            Total: US$ {order.totalPrice}
                        </div>

                        {/* Action Button */}
                        <div>
                            <Link to={`/user/order/${order._id}`}>
                                <AiOutlineArrowRight size={24} className="text-blue-500 hover:text-blue-600 cursor-pointer" />
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const TrackOrder = () => {
    const { allOrders, loading } = useGetAllOrders();

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="pl-8 pt-1">
            {allOrders?.length === 0 ? (
                <p className="text-gray-600">No orders found.</p>
            ) : (
                allOrders.map((order) => (
                    <div
                        key={order._id}
                        className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-md shadow-sm mb-4"
                    >
                        {/* Order Summary Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center w-full">
                            {/* Order ID and Status */}
                            <div className="flex-1 mr-6">
                                <h3 className="text-base font-semibold">
                                    Order: {order._id.slice(0, 10)}...
                                </h3>
                                <p className={`text-sm ${order.status === 'Delivered' ? 'text-green-500' : 'text-orange-500'}`}>
                                    {order.status}
                                </p>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 mr-6">
                                {order?.cart && order.cart.length > 0 ? (
                                    <p className="text-sm text-gray-600">
                                        {order?.cart[0].name.length > 15
                                            ? `${order?.cart[0].name.slice(0, 15)}...`
                                            : order?.cart[0].name}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-600">No items found</p>
                                )}
                            </div>

                            {/* Total Price */}
                            <div className="flex-1 text-sm text-gray-700 text-center">
                                Total: US$ {order.totalPrice}
                            </div>

                            {/* Action Button */}
                            <div className="flex-none">
                                <Link to={`/user/track/order/${order._id}`} className="flex justify-end">
                                    <MdTrackChanges size={24} className="text-blue-500 hover:text-blue-600 cursor-pointer" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordChangeHandler = async (e) => {
        e.preventDefault();

        await axios.put(`${server}/user/update-user-password`,
            { currentPassword, newPassword, confirmPassword },
            { withCredentials: true })
            .then((res) => {
                toast.success("Password Updated Succesfully");
                setCurrentPassword("");
                setNewPassword('');
                setConfirmPassword('')
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }
    return (
        <div className="w-full px-5">
            <h1 className=' block text-center text-[25px] font-[600] text-[#000000ba]'>
                Change Password
            </h1>
            <div className="w-full">
                <form aria-required onSubmit={passwordChangeHandler} className='flex flex-col items-center'>
                    <div className="w-[100%] 800px:w-[50%] mt-5">
                        <label className='block pb-2'>Enter your current password</label>
                        <input type="password" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>

                    <div className="w-[100%] 800px:w-[50%] mt-2">
                        <label className='block pb-2'>Enter your new password</label>
                        <input type="password" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="w-[100%] 800px:w-[50%] mt-2">
                        <label className='block pb-2'>Confirm your new password</label>
                        <input type="password" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <input type="submit" className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`} value="Update" />
                </form>
            </div>
        </div>
    )
}

const Address = () => {
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [addressType, setAddressType] = useState('');
    const { user, loading, handleUpdateAddress } = useUpdateAddress();
    const { deleteUserAddress } = useDeleteAddress();

    const addressTypeData = [
        { name: 'Default' },
        { name: 'Home' },
        { name: 'Office' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (addressType === "" || country === '' || city === '') {
            toast.error("Please fill all the fields");
        } else {
            const addressData = {
                addressType,
                country,
                state,
                city,
                zipCode,
                address1,
                address2,
            };

            try {
                await handleUpdateAddress(addressData);
                setOpen(false);
                // Clear the form fields after successful update
                setAddressType('');
                setCountry('');
                setState('');
                setCity('');
                setZipCode('');
                setAddress1('');
                setAddress2('');
            } catch (error) {
                toast.error('Failed to update address');
            }
        }
    };
    const handleDelete = async (addressId) => {
        try {
            await deleteUserAddress(addressId);
        } catch (error) {
            // Handle error if deletion fails
            toast.error('Error deleting address:', error);
        }
    }

    return (
        <div className="w-full px-5">
            {open && (
                <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center">
                    <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
                        <div className="w-full flex justify-end pb-3">
                            <RxCross1 size={25} className='cursor-pointer fixed m-2' onClick={() => setOpen(false)} />
                        </div>
                        <h1 className='text-center text-[25px] font-Poppins'>Add Address</h1>
                        <div className="w-full">
                            <form aria-required onSubmit={handleSubmit} className='w-full'>
                                <div className="w-full block p-4">
                                    <div className="w-full pb-2">
                                        <label className='block pb-2'>Country</label>
                                        <select name="" id="" value={country} onChange={(e) => setCountry(e.target.value)} className='w-[95%] border h-[40px] rounded-[5px]'>
                                            <option value="">Choose your country</option>
                                            {Country.getAllCountries().map((item) => (
                                                <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full pb-2">
                                        <label className='block pb-2'>State</label>
                                        <select name="" id="" value={state} onChange={(e) => setState(e.target.value)} className='w-[95%] border h-[40px] rounded-[5px]'>
                                            <option value="">Choose your State</option>
                                            {State.getStatesOfCountry(country).map((item) => (
                                                <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full pb-2">
                                        <label className='block pb-2'>City</label>
                                        <select name="" id="" value={city} onChange={(e) => setCity(e.target.value)} className='w-[95%] border h-[40px] rounded-[5px]'>
                                            <option value="">Choose your City</option>
                                            {City.getCitiesOfState(country, state).map((item) => (
                                                <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full pb-2">
                                        <label className='block pb-2'>Address1</label>
                                        <input type="text" className={`${styles.input}`} required value={address1} onChange={(e) => setAddress1(e.target.value)} />
                                    </div>
                                    <div className="w-full pb-2">
                                        <label className='block pb-2'>Address2</label>
                                        <input type="text" className={`${styles.input}`} value={address2} onChange={(e) => setAddress2(e.target.value)} />
                                    </div>
                                    <div className="w-full pb-2">
                                        <label className='block pb-2'>Zip Code</label>
                                        <input type="text" className={`${styles.input}`} required value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                                    </div>
                                    <div className="w-full pb-2">
                                        <label className='block pb-2'>Address Type</label>
                                        <select name="" id="" value={addressType} onChange={(e) => setAddressType(e.target.value)} className='w-[95%] border h-[40px] rounded-[5px]'>
                                            <option value="">Choose your Address Type</option>
                                            {addressTypeData.map((item) => (
                                                <option key={item.name} value={item.name}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full pb-2">
                                        <input type="submit" className={`${styles.input} mt-5 cursor-pointer`} value="Submit" disabled={loading} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex w-full items-center justify-between">
                <h1 className='text-[25px] font-[600] text-[#000000ba]'>My Addresses</h1>
                <div className={`${styles.button} !rounded-md`} onClick={() => setOpen(true)}>
                    <span className='text-[#fff]'>Add New</span>
                </div>
            </div>
            <br />
            {
                user && user.addresses.map((item, index) => (
                    <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
                        <div className="flex items-center">
                            <h5 className='pl-5 font-[600]'> {item.addressType}</h5>
                        </div>
                        <div className="pl-8  flex-grow flex items-center">
                            <h6>{item.address1},{item.address2}</h6>
                        </div>
                        <div className="pl-8 flex items-center">
                            <h6>{user && user.phoneNumber}</h6>
                        </div>
                        <div className="min-w-[10%] flex items-center justify-between pl-8">
                            <AiOutlineDelete size={25} className='cursor-pointer' onClick={() => handleDelete(item._id)} />
                        </div>
                    </div>
                ))
            }
            {
                user && user.addresses.length === 0 && (
                    <h5 className="text-center pt-8 text-[20px]">
                        You don't have any saved address
                    </h5>
                )
            }
        </div>
    );
};


export default ProfileContent;
