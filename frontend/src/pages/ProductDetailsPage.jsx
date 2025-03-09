import React, { useEffect, useState } from 'react';
import ProductDetails from '../components/Products/ProductDetails';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useParams, useSearchParams } from 'react-router-dom';
import SuggestedProduct from '../components/Products/SuggestedProduct';
import useGetAllProducts from '../hooks/getAllProducts';
import { useRecoilValue } from 'recoil';
import { allEventsState } from '../recoil/atoms/allevents';


const ProductDetailsPage = () => {
  const [data, setData] = useState("");
  const { id } = useParams();
  const {products} = useGetAllProducts();
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const allEvents = useRecoilValue(allEventsState);

  useEffect(() => {
    if(eventData !== null){
      const eventsData = allEvents && allEvents.find((i) => i._id === id);
      setData(eventsData);
    }else{
      const productData = products && products.find((i) => i._id === id);
      setData(productData);
    }
  }, [products, allEvents])
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {
        !eventData && (
          <>
            <SuggestedProduct data={data} />
          </>
        )
      }
      <Footer />
    </div>
  )
}

export default ProductDetailsPage