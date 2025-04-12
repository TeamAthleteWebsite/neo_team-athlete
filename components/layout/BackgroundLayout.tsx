import { twc } from "react-twc";

export const BackgroundLayout = twc.div`
  min-h-[calc(100vh-140px)] 
  relative 
  flex 
  items-center 
  justify-center 
  py-8 
  px-4
  bg-[url('/images/athlete-background.webp')]
  bg-cover
  bg-center
  bg-no-repeat
`;
