import React from "react";
import { Heart } from "lucide-react";

const ProductCard = ({
  image,
  category,
  title,
  price,
  delay,
  tag,
}) => {
  return (
    <div className="group relative">

      <div className="bg-[#f3f3f1] rounded-2xl overflow-hidden mb-5 relative aspect-[3/4] flex items-center justify-center">

        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
        />

        <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full">
          <Heart size={16} />
        </button>

        {tag && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/90 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase">
              {tag}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1 px-1">
        <p className="text-[#b36b5d] text-[10px] font-bold uppercase tracking-[0.2em]">
          {category}
        </p>

        <h3 className="text-sm font-medium text-gray-800">
          {title}
        </h3>

        <p className="font-semibold text-gray-900 mt-1">
          {price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;