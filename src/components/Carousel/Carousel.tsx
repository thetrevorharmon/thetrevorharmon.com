import classnames from 'classnames';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Breakout} from '../Breakout';
import {Icon} from '../Icon';

import './Carousel.scss';

// Use it in MDX by wrapping markdown images, like TwoUp. The image title
// becomes the caption:
//
//   <Carousel>
//
//   ![Gollum pumpkin](./2026-the-hobbit-gollum.jpeg "Gollum")
//
//   </Carousel>
//
// gatsby-remark-images turns each image into a block of HTML before it gets
// here. That HTML carries the photo's shape (as a padding-bottom percentage)
// and its caption, which is all the layout needs.

interface Photo {
  html: string;
  captionHtml: string | null;
  aspectRatio: number;
}

interface Props {
  children: React.ReactNode;
}

function collectPhotos(children: React.ReactNode): Photo[] {
  const photos: Photo[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }
    const props = child.props as {
      children?: React.ReactNode;
      dangerouslySetInnerHTML?: {__html?: unknown};
    };
    const html = props.dangerouslySetInnerHTML?.__html;

    if (typeof html === 'string' && html.includes('gatsby-resp-image')) {
      const padding = html.match(/padding-bottom:\s*([\d.]+)%/);
      const caption = html.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/);
      if (padding == null) {
        return;
      }
      photos.push({
        html: html.replace(/<figcaption[\s\S]*?<\/figcaption>/, ''),
        captionHtml: caption?.[1].trim() ?? null,
        aspectRatio: 100 / Number(padding[1]),
      });
    } else if (child.type === 'img') {
      // gatsby-remark-images skipped it, usually because the path has spaces.
      console.warn('Carousel: image was not processed', child.props);
    } else if (props.children != null) {
      // MDX sometimes wraps the images in a paragraph.
      photos.push(...collectPhotos(props.children));
    }
  });

  return photos;
}

function isPortrait(photo: Photo) {
  return photo.aspectRatio < 1;
}

// Matches gap-x-small, the space between photos.
const GAP = '1rem';
// Half the carousel, so two tall photos fill it side by side.
const HALF_WIDTH = `calc((100cqw - ${GAP}) / 2)`;

// Every photo in the carousel shares one height.
//
// When there are wide photos, they set the height: it's the height at which the
// widest one fills the carousel's width. Tall photos fill half the width and
// crop a little off the top and bottom to match. Wide photos are never cropped.
//
// With only tall photos, it's the height at which the widest of them fills half
// the width, so none of them crop at the sides.
function photoHeight(photos: Photo[]) {
  const wide = photos.filter((photo) => !isPortrait(photo));
  if (wide.length > 0) {
    const widest = Math.max(...wide.map((photo) => photo.aspectRatio));
    return `calc(100cqw / ${widest.toFixed(4)})`;
  }
  const widest = Math.max(...photos.map((photo) => photo.aspectRatio));
  return `calc(${HALF_WIDTH} / ${widest.toFixed(4)})`;
}

function CarouselPhoto({photo}: {photo: Photo}) {
  // Set the width outright instead of leaving it to aspect-ratio. Safari
  // otherwise sizes the figure from the full-size image, so it comes out
  // several times too wide and the photos overlap.
  const width = isPortrait(photo)
    ? HALF_WIDTH
    : `calc(var(--photo-height) * ${photo.aspectRatio})`;

  return (
    <figure
      className="flex-none snap-start my-0"
      style={{width}}
      role="group"
      aria-roledescription="slide"
    >
      <div
        className="Carousel-Image w-full h-[var(--photo-height)] rounded-md overflow-hidden isolate"
        dangerouslySetInnerHTML={{__html: photo.html}}
      />
      {photo.captionHtml != null && (
        <figcaption
          className="Caption mt-little"
          dangerouslySetInnerHTML={{__html: photo.captionHtml}}
        />
      )}
    </figure>
  );
}

export function Carousel({children}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const photos = collectPhotos(children);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (track == null) {
      return;
    }
    setCanPrev(track.scrollLeft > 1);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (track == null) {
      return;
    }
    updateArrows();
    const observer = new ResizeObserver(updateArrows);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateArrows]);

  // Next brings in the first photo that isn't fully visible, lined up on the
  // left. Near the end the browser stops at the last photo's right edge, so
  // three tall photos give two views: 1 & 2, then 2 & 3.
  //
  // Previous does the reverse: it brings in the photo just off the left edge,
  // lined up so the view ends at that photo's right edge where possible.
  function step(direction: 1 | -1) {
    const track = trackRef.current;
    if (track == null) {
      return;
    }
    const items = Array.from(track.children).map((child) => {
      const element = child as HTMLElement;
      return {
        left: element.offsetLeft,
        right: element.offsetLeft + element.offsetWidth,
      };
    });
    const viewLeft = track.scrollLeft;
    const viewRight = viewLeft + track.clientWidth;

    let target = 0;
    if (direction === 1) {
      const next = items.find((item) => item.right > viewRight + 1);
      target = next?.left ?? track.scrollWidth;
    } else {
      const previous = [...items]
        .reverse()
        .find((item) => item.left < viewLeft - 1);
      if (previous != null) {
        const earliest = previous.right - track.clientWidth;
        const start = items.find((item) => item.left >= earliest - 1);
        target = start?.left ?? previous.left;
      }
    }

    track.scrollTo({left: target, behavior: 'smooth'});
  }

  if (photos.length === 0) {
    return null;
  }

  const arrowClassName = (visible: boolean) =>
    classnames(
      // Centered on the photos, ignoring the caption below them.
      'absolute z-10 top-[calc(50%-1rem)] -translate-y-1/2',
      'flex items-center justify-center w-[40px] h-[40px] rounded-full',
      'bg-body-bg/90 dark:bg-body-bg-dark/90 shadow-md',
      'text-text-bold dark:text-text-bold-dark',
      'hover:text-primary-text dark:hover:text-primary-text-dark',
      'transition-opacity',
      visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
    );

  return (
    <Breakout>
      <div
        // The container type lets photoHeight measure the carousel's width.
        className="relative my-medium [container-type:inline-size]"
        style={{'--photo-height': photoHeight(photos)} as React.CSSProperties}
        role="region"
        aria-roledescription="carousel"
      >
        <div
          ref={trackRef}
          onScroll={updateArrows}
          tabIndex={0}
          className={classnames(
            'relative flex gap-x-small overflow-x-auto',
            'snap-x snap-mandatory',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {photos.map((photo, index) => (
            <CarouselPhoto key={index} photo={photo} />
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => step(-1)}
          className={classnames(arrowClassName(canPrev), 'left-little')}
        >
          <Icon name="arrowRight" size="normal" className="rotate-180" />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => step(1)}
          className={classnames(arrowClassName(canNext), 'right-little')}
        >
          <Icon name="arrowRight" size="normal" />
        </button>
      </div>
    </Breakout>
  );
}
