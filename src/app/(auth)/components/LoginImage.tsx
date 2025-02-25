
import Login from "@/assets/images/LoginImage.png"
import Image from "next/image";
export 
const LoginImage = () => {
  return (
    <div className="w-full bg-[#F8F9FE] ">
      <div className="relative ">
        <Image src={Login} alt="Tennis player illustration"
        // layout="fill" // This makes the image take up the full space of the parent container
        objectFit="cover" 
        width={569} className="w-full  object-cover rounded "
        />
      </div>
    </div>
  );
};
export default LoginImage;
