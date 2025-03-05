import UserProfileImage from "@/assets/images/Product1.png";
import Image from "next/image";


const ProductCard= ({ product }) => {
  return (
    <div className="w-full overflow-hidden   transition-shadow duration-300  ">
      {/* <Image
        className="w-full h-50 object-cover rounded-[10px]"
        src={UserProfileImage}
        alt={product.name}
        width={200}
        height={100}
        sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, (max-width: 1024px) 180px, 300px"
      /> */}

{/* <Image
  className="w-full h-50 object-cover rounded-[10px]"
  src={UserProfileImage}
  alt={product.name || "User profile image"}
  width={300}  // Set a reasonable default width
  height={150} // Adjusted to maintain aspect ratio
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 300px"
  loading="lazy" // Optional: Improve page load performance
  placeholder="blur" // Optional: Enhance user experience (if supported by src)
  quality={80} // Optional: Balance quality and file size
/> */}

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