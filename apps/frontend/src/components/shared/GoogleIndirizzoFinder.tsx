import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { estraiDatiDaAddressComponents } from "@/utils/estraiDatiIndirizzo";

const defaultPos = { lat: 41.9028, lng: 12.4964 };
const LIBRARIES = ["places"];
const createLatLng = (lat, lng) => ({ lat: Number(lat), lng: Number(lng) });

export default function GoogleIndirizzoFinder({ open, onClose, onConferma }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    language: "it",
  });

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");
  const [location, setLocation] = useState(createLatLng(defaultPos.lat, defaultPos.lng));
  const [address, setAddress] = useState({
    indirizzo: "",
    cap: "",
    comune: "",
    provincia: "",
    stato: "", // 👈 questo
    latitudine: null,
    longitudine: null,
  });

const handlePlace = (place) => {
  if (!place?.geometry?.location) {
    toast.error("Indirizzo non valido o non geolocalizzabile");
    return;
  }

  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();
  const dati = estraiDatiDaAddressComponents(place.address_components);

  const isItaly = dati.stato?.toLowerCase() === "italia";
  const newLocation = { lat: Number(lat), lng: Number(lng) };

  setLocation(newLocation);

  if (mapRef.current) {
    mapRef.current.panTo(newLocation);
  }

  setAddress({
    indirizzo: place.formatted_address,
    cap: dati.cap,
    comune: dati.comune,
    provincia: isItaly ? dati.provincia : "EE",
    stato: dati.stato,
    latitudine: lat,
    longitudine: lng,
  });

  setSearchInput(place.formatted_address);
};

  useEffect(() => {
    if (!open) autocompleteRef.current = null;
  }, [open]);

  useEffect(() => {
    if (!isLoaded || !open) return;
    let pollingTimeout;

    const initAutocomplete = () => {
      if (window.google?.maps?.places && inputRef.current && !autocompleteRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ["geometry", "formatted_address", "address_components"],
        });

        const pollPlace = () => {
          pollingTimeout = setTimeout(() => {
            const place = autocompleteRef.current.getPlace();
            if (place?.geometry?.location) handlePlace(place);
          }, 200);
        };

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          handlePlace(place);
        });

        inputRef.current.addEventListener("blur", pollPlace);
        inputRef.current.addEventListener("mousedown", pollPlace);
        inputRef.current.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            pollPlace();
          }
        });
      }
    };

    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        initAutocomplete();
      });
    }, 300);

    return () => {
      clearTimeout(timeout);
      clearTimeout(pollingTimeout);
    };
  }, [isLoaded, open]);

  const handleAnnulla = () => {
    setSearchInput("");
    setAddress({
      indirizzo: "",
      cap: "",
      comune: "",
      provincia: "",
      latitudine: null,
      longitudine: null,
    });
    setLocation(createLatLng(defaultPos.lat, defaultPos.lng));
    onClose();
  };

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
              onLoad={(map) => (mapRef.current = map)}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onClick={(e) => {
                const lat = e.latLng?.lat();
                const lng = e.latLng?.lng();
                if (lat && lng) {
                  const pos = createLatLng(lat, lng);
                  setLocation(pos);
                  setAddress((prev) => ({
                    ...prev,
                    latitudine: lat,
                    longitudine: lng,
                  }));
                }
              }}
            >
              <Marker
                key={`dynamic-${location.lat}-${location.lng}`}
                position={location}
                draggable={true}
                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                onDragEnd={(e) => {
                  const lat = e.latLng?.lat();
                  const lng = e.latLng?.lng();
                  console.log("🟢 Marker spostato:", lat, lng);
                  if (lat && lng) {
                    const pos = createLatLng(lat, lng);
                    setLocation(pos);
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
          <Button variant="secondary" onClick={handleAnnulla}>
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
