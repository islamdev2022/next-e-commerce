"use client"
import React from 'react';
import {PlaceholdersAndVanishInput} from './ui/placeholders-and-vanish-input';
import { Cart } from './component/cart';
// import { cookies } from 'next/headers'
const Header = ({sessionId}: {sessionId: any}) => {
  console.log("session from header", sessionId);
      return (
        <>
          <div className='flex mt-6 justify-between items-center gap-5 px-3 sm:px-10 w-full'>
            <div>
              <img src="/assets/next.svg" alt="" className='w-20'/>
            </div>
            <PlaceholdersAndVanishInput
              placeholders={["T-shirt", "Shoes","Shorts"]}
              onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                throw new Error("Function not implemented.");
              }}
              onSubmit={function (e: React.FormEvent<HTMLFormElement>): void {
                throw new Error("Function not implemented.");
              }}
            />
            <Cart SessionId={sessionId}></Cart>
          </div>
        </>
      );
    // } else {
    //   console.log('Session ID not found');
    // }
   
    // return null;
}
 
export default Header;