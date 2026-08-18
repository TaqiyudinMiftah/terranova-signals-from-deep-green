const video = document.getElementById('bg-video');
const card = document.querySelector('[data-glass-card]');
const duplicateContainer = document.getElementById('dup-video-container');
const canvas = document.getElementById('dup-image');
const ctx = canvas.getContext('2d');

const DUP_PIXEL_RATIO = 1;

function syncGlassFrame() {
  const rect = card.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  if (!rect.width || !rect.height || !video.videoWidth || !video.videoHeight) {
    requestAnimationFrame(syncGlassFrame);
    return;
  }

  // The duplicate is viewport-sized on purpose. The SVG filter shifts each color
  // channel independently, so filtering only a card-sized source would expose hard
  // channel-separation bands at the source edges. Viewport sizing pushes those bands
  // outside the card, leaving only the clean refracted region visible through it.
  duplicateContainer.style.left = `${-rect.left}px`;
  duplicateContainer.style.top = `${-rect.top}px`;
  duplicateContainer.style.width = `${vw}px`;
  duplicateContainer.style.height = `${vh}px`;

  const w = Math.max(1, Math.round(vw * DUP_PIXEL_RATIO));
  const h = Math.max(1, Math.round(vh * DUP_PIXEL_RATIO));

  // Keep the duplicate at 1x even on retina: the SVG filter's cost scales with pixel
  // count, and this is a deliberately soft refraction where 4x filter work buys nothing.
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  canvas.style.width = `${vw}px`;
  canvas.style.height = `${vh}px`;

  const cover = Math.max(vw / video.videoWidth, vh / video.videoHeight);
  const sw = vw / cover;
  const sh = vh / cover;
  const sx = (video.videoWidth - sw) / 2;
  const sy = (video.videoHeight - sh) / 2;

  try {
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
  } catch {
    // A decoded frame may not be available yet; the next rAF will try again.
  }

  requestAnimationFrame(syncGlassFrame);
}

requestAnimationFrame(syncGlassFrame);
