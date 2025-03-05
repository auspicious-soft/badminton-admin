import UserProfileImage from "@/assets/images/Product1.png";
import Image from "next/image";


const ProductCard = ({ product }) => {
  return (
    <div className="w-full overflow-hidden   transition-shadow duration-300  ">
      <Image
        className="w-full h-auto max-h-[300px] sm:max-h-[300px] object-contain rounded-[10px]"
        src={UserProfileImage}
        alt={product.name || "User profile image"}
        width={300}
        height={150}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 300px"
        loading="lazy"
        placeholder="blur"
        quality={100}
      />
      <div className="px-4 py-3">
        <div className="text-[#1b2229] text-center text-sm font-semibold leading-[18.84px]">
          {product.name}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;