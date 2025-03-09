import React, { useState, useEffect } from 'react';
import styles from '../../styles/styles';
import { Link } from 'react-router-dom';
import logo from "../../Assets/isolated-monochrome-black.svg";
import { categoriesData} from "../../static/data";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { BiMenuAltLeft } from 'react-icons/bi';
import DropDown from './DropDown';
import NavBar from './NavBar';
import { CgProfile } from 'react-icons/cg'
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms/user';
import { sellerState } from '../../recoil/atoms/seller';
import { backend_url } from '../../server';
import Cart from "../Cart";
import WishList from "../WishList";
import { RxCross1 } from 'react-icons/rx';
import {allProductsState} from '../../recoil/atoms/allProducts';
import { cartState } from '../../recoil/atoms/cart';
import { wishlistState } from '../../recoil/atoms/wishlist';


const Header = ({ activeHeading }) => {

  const [searchTerm, setSearchTerm] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [open, setOpen] = useState(false);

  const allProducts = useRecoilValue(allProductsState);
  const cart = useRecoilValue(cartState);
  const wishlist = useRecoilValue(wishlistState);

  const user = useRecoilValue(userState);
  const isAuthenticated = user.isAuthenticated;
  
  const seller = useRecoilValue(sellerState);
  const sellerIsAuthenticated = seller.isAuthenticated;

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    if (term.trim() === "") {
      setSearchData(null);
    } else {
      const filteredProducts = allProducts && allProducts.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
      setSearchData(filteredProducts);
    }
  }
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img className='h-10'
                src={logo}
                alt="logo"
              />
            </Link>
          </div>

          {/* Search Box */}
          <div className="hidden sm:block w-full sm:w-1/2 relative">
            <input type="text" placeholder='Search Products...' value={searchTerm} onChange={handleSearchChange}
              className='h-[40px] w-full px-2 border-[#ad50ff] border-[2px] rounded-md' />
            <AiOutlineSearch size={30} className='absolute right-2 top-1.5 cursor-pointer' />
            {searchData && searchData.length !== 0 && (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4 w-[100%]">
                {searchData.map((product, index) => {
                  return (
                    <Link to={`product/${product._id}`} key={index}>
                      <div className="w-full flex items-start py-3">
                        <img src={`${backend_url}/${product.images[0]}`} alt=""
                          className='w-[40px] h-[40px] mr-[10px]' />
                        <h1>{product.name}</h1>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className={`${styles.button}`}>
            <Link to="/shop-create">
              <h1 className='text-[#fff] flex items-center'>
                {sellerIsAuthenticated ? "Dashboard" : "Become Seller"} <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null} transition hidden 800px:flex items-center justify-between w-full bg-[#63239c] h-[70px]`}>
        <div className={`${styles.section} relative ${styles.normalFlex}  justify-between`}>
          {/* Categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className='relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block'>
              <BiMenuAltLeft size={30} className='absolute top-3 left-2' />
              <button className='h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md'>
                All Categories
              </button>
              <IoIosArrowDown size={20} className='absolute right-2 top-4 cursor-pointer' onClick={() => setDropDown(!dropDown)} />
              {
                dropDown ? (
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown} />
                ) : null
              }
            </div>
          </div>

          {/* Navbar */}
          <div className={`${styles.normalFlex}`}>
            <NavBar active={activeHeading} />
          </div>
          <div className='flex'>
            <div className={`${styles.normalFlex}`}>
              <div className="relative cursor-pointer mr-[15px]" onClick={()=> setOpenWishList(true)}>
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83% " />
                <span className='absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center'>
                  {wishlist && wishlist.length}
                </span>
              </div>
              <div className={`${styles.normalFlex}`}>
                <div className="relative cursor-pointer mr-[15px]" onClick={() => setOpenCart(true)}>
                  <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83% " />
                  <span className='absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center'>
                    {cart && cart.length}
                  </span>
                </div>
              </div>
              <div className={`${styles.normalFlex}`}>
                <div className="relative cursor-pointer mr-[15px]">
                  {
                    isAuthenticated ? (
                      <Link to="/profile">
                        <img src={`${backend_url}${user.avatar}`} alt="" className='w-[35px] h-[35px] rounded-full' />
                      </Link>
                    ) : (

                      <Link to="/login">
                        <CgProfile size={30} color="rgb(255 255 255 / 83% " />
                      </Link>
                    )}
                </div>
              </div>
            </div>
            {/* Cart Popup */}
            {
              openCart ? (
                <Cart setOpenCart={setOpenCart} />
              ) : null
            }

            {/* WhishList Popup */}
            {
              openWishList ? (
                <WishList setOpenWishList={setOpenWishList} />
              ) : null
            }
          </div>
        </div>
      </div>
       {/* mobile header */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        }
      w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img
                src={logo}
                alt=""
                className="mt-3 cursor-pointer h-8"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />
              <span class="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
        </div>

        {/* header sidebar */}
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span class="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px relative]">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                    {searchData.map((product) => {
                      return (
                        <Link to={`/product/${product._id}`}>
                          <div className="flex items-center">
                            <img
                              src={`${backend_url}/${product.images[0]}`}
                              alt=""
                              className="w-[50px] mr-2"
                            />
                            <h5>{product.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <NavBar active={activeHeading} />
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${backend_url}${user.avatar}`}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
