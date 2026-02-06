import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { AuthContextType } from "@/types";

export function useAuth(): AuthContextType{
    const context = useContext(AuthContext);

    if(context === undefined){
        throw new Error('useAuth must be used withing an AuthProvider')
    }

    return context;
}