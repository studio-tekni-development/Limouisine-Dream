// app/page.tsx
import { client } from '@/sanity/lib/client';
import { homepageQuery } from '@/sanity/lib/queries';
import BackgroundMedia from '@/components/BackgroundMedia/BackgroundMedia';
import Navbar from '@/components/Navbar/Navbar';
import HomePage from '@/components/HomePage/HomePage';

interface HomepageData {
  backgroundColor?: string;
  backgroundType: 'color' | 'video' | 'image';
  // Desktop
  videoSource?: 'upload' | 'link';
  videoFile?: string;
  videoUrl?: string;
  imageSource?: 'upload' | 'link';
  backgroundImage?: string;
  imageUrl?: string;
  // Mobile
  mobileVideoSource?: 'same' | 'upload' | 'link';
  mobileVideoFile?: string;
  mobileVideoUrl?: string;
  mobileImageSource?: 'same' | 'upload' | 'link';
  mobileBackgroundImage?: string;
  mobileImageUrl?: string;
  navigationItems: Array<{ text: string; link?: string }>;
  footerText: string;
}

export default async function Home() {
  let data: HomepageData | null = null;
  
  try {
    data = await client.fetch(homepageQuery);
  } catch (error) {
    console.error('Error fetching homepage data:', error);
  }

  // Default fallback data
  const navigationItems = data?.navigationItems || [
    { text: 'Home', link: '/' },
    { text: 'About', link: '/about' },
    { text: 'Services', link: '/services' },
    { text: 'Work', link: '/work' },
    { text: 'Contact', link: '/contact' },
  ];

  const footerText = data?.footerText || 'Your Footer Text Here';

  // Determine background media
  const backgroundType = data?.backgroundType || 'color';
  
  // Desktop media
  const desktopVideoSrc = data?.videoSource === 'upload' ? data?.videoFile : data?.videoUrl;
  const desktopImageSrc = data?.imageSource === 'upload' ? data?.backgroundImage : data?.imageUrl;
  
  // Mobile media (use desktop if not specified)
  const mobileVideoSrc = data?.mobileVideoSource === 'upload' 
    ? data?.mobileVideoFile 
    : data?.mobileVideoSource === 'link' 
      ? data?.mobileVideoUrl 
      : desktopVideoSrc;
      
  const mobileImageSrc = data?.mobileImageSource === 'upload'
    ? data?.mobileBackgroundImage
    : data?.mobileImageSource === 'link'
      ? data?.mobileImageUrl
      : desktopImageSrc;

  return (
    <>
      <BackgroundMedia 
        type={backgroundType}
        backgroundColor={data?.backgroundColor}
        videoUrl={data?.videoSource === 'link' ? data?.videoUrl : undefined}
        videoFile={data?.videoSource === 'upload' ? data?.videoFile : undefined}
        imageUrl={backgroundType === 'image' ? desktopImageSrc : undefined}
        mobileVideoUrl={data?.mobileVideoSource === 'link' ? data?.mobileVideoUrl : undefined}
        mobileVideoFile={data?.mobileVideoSource === 'upload' ? data?.mobileVideoFile : undefined}
        mobileImageUrl={backgroundType === 'image' ? mobileImageSrc : undefined}
      />
      
      <Navbar items={navigationItems} />
      <HomePage footerText={footerText} />
    </>
  );
}
