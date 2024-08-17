'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};

export const RecoilProvider = ({ children }: {children: React.ReactNode}) => {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  )
}