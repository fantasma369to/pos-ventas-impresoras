import { create } from "zustand";
import {MostrarSucursalCajaAsignada} from "../supabase/crudAsignacionCajaSucursal"
export const useAsignacionCajaSucursalStore= create((set)=>({
    dataSucursalesAsignadas:null,
    sucursalesItemSelectAsignadas:null,
    mostrarSucursalCajaAsignada:async(p)=>{
        const response = await MostrarSucursalCajaAsignada(p)
        set({dataSucursalesAsignadas:response})
        set({sucursalesItemSelectAsignadas:response})
return response;
    }
}))