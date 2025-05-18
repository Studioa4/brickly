// src/components/shared/GoogleIndirizzoFinder.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { estraiDatiDaAddressComponents } from "@/utils/estraiDatiIndirizzo";

const defaultPos = { lat: 41.9028, lng: 12.4964 };
const LIBRARIES: ("places")[] = ["places"];

export default function GoogleIndirizzoFinder({ open, onClose, onConferma }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    language: "it",
  });

  const mapRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  const [searchInput, setSearchInput] = useState("");
  const [location, setLocation] = useState(defaultPos);
  const [address, setAddress] = useState({
    indirizzo: "",
    cap: "",
    comune: "",
    provincia: "",
    latitudine: null,
    longitudine: null,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["geometry", "formatted_address", "address_components"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();

      if (!place?.geometry?.location) {
        toast.error("Indirizzo non valido o non geolocalizzabile");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const dati = estraiDatiDaAddressComponents(place.address_components);

      setLocation({ lat, lng });
      setAddress({
        indirizzo: place.formatted_address,
        cap: dati.cap,
        comune: dati.comune,
        provincia: dati.provincia,
        latitudine: lat,
        longitudine: lng,
      });

      setSearchInput(place.formatted_address);
    });
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl" aria-describedby="map-desc">
        <DialogHeader>
          <DialogTitle>📍 Cerca indirizzo su Google Maps</DialogTitle>
          <DialogDescription id="map-desc">
            Digita l'indirizzo e selezionalo con tastiera o mouse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            ref={inputRef}
            className="border p-2 w-full rounded"
            placeholder="Scrivi l'indirizzo completo"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <div className="h-[300px]">
            <GoogleMap
              center={location}
              zoom={16}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onLoad={(map) => (mapRef.current = map)}
              onClick={(e) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();
                if (lat && lng) {
                  setLocation({ lat, lng });
                  setAddress((prev) => ({
                    ...prev,
                    latitudine: lat,
                    longitudine: lng,
                  }));
                }
              }}
            >
              <Marker
                position={location}
                draggable={true}
                onDragEnd={(e) => {
                  const lat = e.latLng?.lat();
                  const lng = e.latLng?.lng();
                  if (lat && lng) {
                    setLocation({ lat, lng });
                    setAddress((prev) => ({
                      ...prev,
                      latitudine: lat,
                      longitudine: lng,
                    }));
                  }
                }}
              />
            </GoogleMap>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose}>
            Annulla
          </Button>
          <Button
            onClick={() => {
              if (!address.indirizzo) {
                toast.error("Devi selezionare un indirizzo valido");
                return;
              }
              onConferma(address);
            }}
          >
            Conferma
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
