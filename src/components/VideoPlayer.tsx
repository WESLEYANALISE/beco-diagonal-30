
import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  title: string;
}

export const VideoPlayer = ({ videoUrl, thumbnail, title }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const openFullscreen = () => {
    window.open(videoUrl, '_blank');
  };

  if (!isPlaying) {
    return (
      <div className="relative aspect-video overflow-hidden bg-black rounded-lg group cursor-pointer" onClick={handlePlay}>
        <img 
          src={thumbnail || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop"} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
          <div className="bg-red-600 rounded-full p-4 opacity-90 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden bg-black rounded-lg">
      <iframe
        src={`${videoUrl}?autoplay=1&mute=${isMuted ? 1 : 0}`}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <Button
          size="sm"
          variant="secondary"
          className="bg-black/50 hover:bg-black/70 text-white border-0"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-black/50 hover:bg-black/70 text-white border-0"
          onClick={openFullscreen}
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
