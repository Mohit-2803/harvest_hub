"use client";

import React from "react";

type CartCountContextType = {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
};

const CartCountContext = React.createContext<CartCountContextType | undefined>(
  undefined
);

export const CartCountProvider = ({
  children,
  initialCount = 0,
}: {
  children: React.ReactNode;
  initialCount?: number;
}) => {
  const [cartCount, setCartCount] = React.useState(initialCount);
  const value = React.useMemo(() => ({ cartCount, setCartCount }), [cartCount]);

  return (
    <CartCountContext.Provider value={value}>
      {children}
    </CartCountContext.Provider>
  );
};

export const useCartCount = () => {
  const context = React.useContext(CartCountContext);
  if (!context) {
    throw new Error("useCartCount must be used within a CartCountProvider");
  }
  return context;
};
