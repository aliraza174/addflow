"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AdMedia } from "@/lib/domain/types";

export function MediaCarousel({ media, gallery = [] }: { media: AdMedia, gallery?: string[] }) {
  const allMediaUrls = [media.originalUrl, ...gallery].filter(Boolean);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const isYoutube = media.sourceType === "youtube" && currentIndex === 0;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allMediaUrls.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allMediaUrls.length) % allMediaUrls.length);
  };

  if (allMediaUrls.length === 0) {
    return <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground">No media available</div>;
  }

  return (
    <div className="relative group w-full aspect-video bg-black overflow-hidden rounded-t-xl">
      {isYoutube ? (
        <iframe
          src={`https://www.youtube.com/embed/${getYouTubeID(media.originalUrl)}`}
          title="YouTube video player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <img
          src={allMediaUrls[currentIndex]}
          alt={`Media ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      )}

      {allMediaUrls.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={handlePrev}>
              &larr;
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={handleNext}>
              &rarr;
            </Button>
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {allMediaUrls.map((_, i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
