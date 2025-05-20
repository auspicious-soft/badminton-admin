import UserProfileImage from "@/assets/images/Product1.png";
import { getImageClientS3URL } from "@/config/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCard = ({ product ,image }) => {
  const router = useRouter();
  return (
    <div onClick={()=>router.push(`/admin/merchandises/${product._id}`)} className="w-full overflow-hidden transition-shadow duration-300  ">

      <div className="relative w-full aspect-square overflow-hidden rounded-[10px]">
        <Image
          className="object-cover"
          src={image || UserProfileImage}
          alt={product.name || "User profile image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 300px"
          loading="lazy"
          quality={100}
        />
      </div>
      <div className="px-4 py-3">
        <div className="text-[#1b2229] text-center text-sm font-semibold leading-[18.84px]">
          {product.productName}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;