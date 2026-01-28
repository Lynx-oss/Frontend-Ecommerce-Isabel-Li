import { useContext } from "react";
import { CartContext } from "@/context/cartContext";
import { CartContextType } from "@/types";

export function useCart(): CartContextType {
    const context = useContext(CartContext);

    if(context === undefined){
        throw new Error('UseCart must be used within a CartProvider')
    }

    return context;
}