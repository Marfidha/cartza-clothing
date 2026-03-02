import React from 'react'
import fbanner from "../../assets/Gemini_Generated_Image_yolxlyyolxlyyolx_upscayl_4x_upscayl-standard-4x.png";
import image1 from '../../assets/124e0ad041d07136ff34e8ab108f901e.jpg'
import image2 from '../../assets/383d40c90535805bcfe927cea9c69203.jpg'
import image3 from '../../assets/a7c52818a5d1f30cf14ddad55549e0d3.jpg'
import img4 from '../../assets/5153c8ad3809a30ac6f55cbac5f31e9c.jpg'
import img5 from '../../assets/d613d7e891aec8daf4692b56df2163f3.jpg'
import img6 from '../../assets/003b20cd194f9556605e173a0b23845a.jpg'
import img8 from '../../assets/photo-1520975916090-3105956dac38 (1).jpeg'
import img9 from '../../assets/photo-1512436991641-6745cdb1723f.jpeg'
import img10 from "../../assets/156ab20b87dd55fbd52497c4c69ac3c2.jpg"
import img11 from "../../assets/199acaba06931e2696bd1093335cbebf.jpg"


function Landingpage() {



  return (
   <>


   <div className='w-full h-auto'>
    {/* banner */}
         <div style={{backgroundImage :`url(${fbanner})`, backgroundSize:"100% 100%" }} className='h-screen w-full bg-contain bg-no-repeat flex flex-row items-center justify-center pt-9 '>
            <div className='w-full h-full flex flex-col items-start justify-center pl-19 gap-4'>
                <h1 className='w-[402px] text-white text-6xl italiana-font font-thin tracking-ultra-wide'>TIMELESS ELEGANCE</h1>
                <h1 className='text-white font-abhay  text-2xl'>Discover our new collection</h1>
                <button className='w-[20%] px-10 py-3 border-4 border-white text-white tracking-[0.35em] rounded-2xl bg-transparent font-serif text-lg'>SHOP NOW</button>
            </div>
        </div>  
  

            </div>
            


             
    <div className="bg-white">

      {/* SECTION 1: Elevate Your Everyday Look */}
      {/* SECTION 1: TITLE */}
      <section className="max-w-7xl text-[#4E3528] mx-auto px-6 py-16 text-center">
        <h2 className="text-[28px] tracking-widest font-light mb-4">
          Elevate Your Everyday Look
        </h2>
        <p className="text-[#4E3528] text-sm max-w-2xl mx-auto leading-relaxed">
          Redefine your wardrobe with pieces that speak confidence and grace.
          From street style to statement fits — discover fashion that moves with you.
        </p>
      </section>
         <section className="max-w-7xl mx-auto px-6 pb-20 pt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {[
            image1,
            img11,
            img10
        ].map((img, i) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-2xl shadow-xl"
          >
            {/* Image */}
            <img
              src={img}
              alt="collection"
              className="h-[520px] w-full object-cover 
                         transition-transform duration-700 
                         group-hover:scale-110"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />

            {/* Text */}
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-3xl font-bold mb-2">
                {["New Arrivals", "Summer Collection", "Exclusive Styles"][i]}
              </h2>

              <p className="text-sm opacity-90 mb-4">
                Discover premium fashion designed for you.
              </p>

              <button className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>

             {/* SECTION 2: 3 IMAGE GRID */}
      {/* <section className="max-w-7xl mx-auto px-6 pb-15">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {[
            image1,
            img11,
            img10
           
          ].map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                className="h-[520px] w-full object-cover"
                alt=""
              />
            </div>
          ))}
        </div>

        <p className="text-center pt-10 text-[26px] tracking-[0.3em] font-light text-gray-600">
          Shop the New Neutrals
        </p>
      </section> */}
{/* SECTION 3: CATEGORY CARDS */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {[
            {
              title: "Kid's Style",
              img: img4
            },
            {
              title: "Women's Shorts",
              img: img5,
            },
            {
              title: "Men's Shirts",
              img: img6
            },
          ].map((item, i) => (
            <div key={i} className="relative">
              <img
                src={item.img}
                className="h-[460px] w-full object-cover"
                alt=""
              />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-lg font-light">{item.title}</h3>
                <p className="text-sm underline mt-1">Shop now</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* SECTION 3: Large Promo Banners */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Left Banner */}
          <div className="relative overflow-hidden">
            <img
              src={img8}
              className="w-full h-[500px] object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8">
              <h2 className="text-white text-3xl font-light mb-2">
                Modern Neutral
              </h2>
              <p className="text-white text-sm mb-4 max-w-sm">
                Refine your look with sophisticated staples and versatile fashion.
              </p>
              <button className="border border-white text-white px-6 py-2 w-fit">
                SHOP ALL
              </button>
            </div>
          </div>

          {/* Right Banner */}
          <div className="relative overflow-hidden">
            <img
              src={img9}
              className="w-full h-[500px] object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8">
              <h2 className="text-white text-3xl font-light mb-2">
                New Collection
              </h2>
              <p className="text-white text-sm mb-4 max-w-sm">
                Elevate your wardrobe with updated essentials and bold pieces.
              </p>
              <button className="border border-white text-white px-6 py-2 w-fit">
                SHOP ALL
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
    </>
   
  )
}

export default Landingpage