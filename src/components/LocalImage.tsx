import React from 'react';
import Image, { ImageProps } from 'next/image';

type LocalImageProps = Omit<ImageProps, 'src'> & {
  src: string | any; // Allow both string paths and imported images
};

/**
 * A wrapper around Next.js Image component that always uses unoptimized mode
 * for local images to avoid sharp dependency issues
 */
const LocalImage: React.FC<LocalImageProps> = ({ src, alt, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt || "Image"}
      unoptimized
      {...props}
    />
  );
};

export default LocalImage;
