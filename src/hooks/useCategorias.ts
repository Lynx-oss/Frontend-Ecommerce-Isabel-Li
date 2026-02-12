import { useContext } from "react";
import { CategoriasContext } from "@/context/categoriasContext";
import { CategoriasContextType } from "@/types";

export function useCategorias(): CategoriasContextType {
    const context = useContext(CategoriasContext);

    if(context === undefined){
        throw new Error ('useCategorias must be used within a CategoriasProvider');
    }
    
    return context;
}
