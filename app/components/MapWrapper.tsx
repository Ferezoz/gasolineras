"use client";

import dynamic from "next/dynamic";
import type { Station, FuelType } from "@/app/lib/stations";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-white/40 border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Cargando mapa...</span>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  userLat: number;
  userLng: number;
  stations: Station[];
  fuelType: FuelType;
  selectedId: string | null;
  focusKey: number;
  onSelectStation: (id: string) => void;
  onSearchHere: (lat: number, lng: number) => void;
  onRecenter: () => void;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <Map {...props} />;
}
