import { useQuery } from "@tanstack/react-query";
import {
  POSTemplate,
  SpinnerSecundario,
  useAlmacenesStore,
  useEmpresaStore,
  useProductosStore,
  useSucursalesStore,
  useVentasStore,
} from "../index";
import { useCajasStore } from "../store/CajasStore";
import { useCierreCajaStore } from "../store/CierreCajaStore";
import { PantallaAperturaCaja } from "../components/organismos/POSDesign/CajaDesign/PantallaAperturaCaja";
import { useMetodosPagoStore } from "../store/MetodosPagoStore";
import { useAsignacionCajaSucursalStore } from "../store/AsignacionCajaSucursalStore";

export function POS() {
  const { dataempresa } = useEmpresaStore();
  const { mostrarAlmacenXsucursal } = useAlmacenesStore();
  const { buscarProductos, buscador } = useProductosStore();
  const { sucursalesItemSelectAsignadas } = useAsignacionCajaSucursalStore();
  const { mostrarCajaXSucursal } = useCajasStore();
  const { mostrarCierreCaja } = useCierreCajaStore();
  const { mostrarMetodosPago } = useMetodosPagoStore();
  // Consulta para buscar productos
  useQuery({
    queryKey: ["buscar productos", buscador],
    queryFn: () =>
      buscarProductos({ id_empresa: dataempresa?.id, buscador: buscador }),
    enabled: !!dataempresa,
    refetchOnWindowFocus: false,
  });

  // Consulta para mostrar almacén por sucursal
  const { isLoading: isLoadingAlmacen } = useQuery({
    queryKey: [
      "mostrar almacen por sucursal",
      sucursalesItemSelectAsignadas?.id_sucursal,
    ],
    queryFn: () =>
      mostrarAlmacenXsucursal({
        id_sucursal: sucursalesItemSelectAsignadas?.id_sucursal,
      }),
    enabled: !!sucursalesItemSelectAsignadas,
  });

 

  // Consulta para mostrar cierres de caja
  const {
    data: dataCierreCaja,
    isLoading: isLoadingCierreCaja,
    error: errorCierreCaja,
  } = useQuery({
    queryKey: ["mostrar cierre de caja", { id_caja: sucursalesItemSelectAsignadas?.id_caja }],
    queryFn: () => mostrarCierreCaja({ id_caja: sucursalesItemSelectAsignadas?.id_caja }),
    enabled: !!sucursalesItemSelectAsignadas,
  });
  const { isLoading:isLoadingMetodosPago} = useQuery({
    queryKey: ["mostrar metodos de pago"],
    queryFn: () => mostrarMetodosPago({ id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });
   
  // Unificar los estados de carga
  const isLoading = isLoadingAlmacen  || isLoadingCierreCaja ||isLoadingMetodosPago;

  // Mostrar spinner mientras alguna de las consultas está cargando
  if (isLoading) {
    return <SpinnerSecundario texto="Cargando datos..." />;
  }

  // Manejar errores de la consulta de cierre de caja
  if (errorCierreCaja) {
    return <span>Error: {errorCierreCaja.message}</span>;
  }

  // Mostrar AperturaCaja si no hay datos de cierre de caja
  // if (!dataCierreCaja) {
  //   return <PantallaAperturaCaja />;
  // }

  // // Mostrar POSTemplate si hay datos en dataCierreCaja
  // return <POSTemplate />;
   // Renderizado condicional claro basado en `dataCierreCaja`
   return dataCierreCaja ? <POSTemplate /> : <PantallaAperturaCaja />;
}
