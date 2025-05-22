// components/RadioPlayer.tsx
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Radio } from "lucide-react";

const radioCategories = {
  "Musica Italiana": [
    { name: "Radio Italia - Italian 🇮🇹", url: "https://stream.radioitalia.it/radioitalia.mp3" },
    { name: "RDS - Pop 💃", url: "https://stream.rds.it/rds.mp3" },
    { name: "Radio Deejay - Hits 🕺", url: "https://icecast.deejay.it/deejay.mp3" },
    { name: "Radio 105 - Rock 🎸", url: "https://stream.radio.it/105.mp3" },
    { name: "RTL 102.5 - Hits 🎶", url: "https://streaming.rtl.it/rtl1025.mp3" }
  ],
  "Talk e News": [
    { name: "Radio 24 - News 🗞️", url: "https://icecast.radio24.it/radio24.mp3" },
    { name: "RAI Radio 1 - Talk 🗣️", url: "https://icestreaming.rai.it/1.mp3" },
    { name: "RAI Radio 2 - Intrattenimento 🎤", url: "https://icestreaming.rai.it/2.mp3" }
  ],
  "Rock e Classici": [
    { name: "Radio Capital - Classic Rock 🎧", url: "https://icecast.unitedradio.it/RadioCapital.mp3" },
    { name: "Virgin Radio - Rock 🤘", url: "https://icecast.virginradio.it/virgin.mp3" }
  ],
  "Musica Classica": [
    { name: "RAI Radio 3 - Classica 🎻", url: "https://icestreaming.rai.it/3.mp3" },
    { name: "Venice Classic Radio - Italia 🇮🇹🎼", url: "https://uk3.internet-radio.com:8276/stream" },
    { name: "ABC Classic - Australia 🇦🇺🎼", url: "http://live-radio01.mediahubaustralia.com/ABC_CLASSIC.mp3" },
    { name: "Classic FM - UK 🇬🇧🎼", url: "https://media-ice.musicradio.com/ClassicFMMP3" },
    { name: "Rondo Classic - Finland 🇫🇮🎼", url: "https://live.rondoclassic.fi/rondoclassic" }
  ]
};

const allRadios = Object.values(radioCategories).flat();

export default function RadioPlayer() {
  const [currentRadio, setCurrentRadio] = useState(allRadios[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, currentRadio]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = allRadios.find(r => r.name === e.target.value);
    if (selected) setCurrentRadio(selected);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 flex items-center justify-between shadow z-50">
      <div className="flex items-center gap-2">
        <Radio size={20} className="text-gray-700" />
        <select
          className="border rounded px-2 py-1 text-sm"
          value={currentRadio.name}
          onChange={handleChange}
        >
          {Object.entries(radioCategories).map(([category, radios]) => (
            <optgroup key={category} label={category}>
              {radios.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <button
        onClick={togglePlay}
        className="p-2 rounded-full hover:bg-gray-200"
        title={isPlaying ? "Pausa" : "Riproduci"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <audio ref={audioRef} src={currentRadio.url} />
    </footer>
  );
}
