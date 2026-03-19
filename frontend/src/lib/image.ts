type ImageTransformOptions = {
  width?: number;
  quality?: number;
};

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isKnownImageHost(hostname: string) {
  return (
    hostname.includes("images.unsplash.com") ||
    hostname.includes("images.pexels.com") ||
    hostname.includes("dummyjson.com")
  );
}

export function withImageParams(src: string, options: ImageTransformOptions) {
  if (!src || !isAbsoluteUrl(src)) {
    return src;
  }

  try {
    const url = new URL(src);

    if (!isKnownImageHost(url.hostname)) {
      return src;
    }

    if (url.hostname.includes("images.unsplash.com")) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      if (options.width) url.searchParams.set("w", String(options.width));
      if (options.quality) url.searchParams.set("q", String(options.quality));
      url.searchParams.delete("dpr");
      return url.toString();
    }

    if (url.hostname.includes("images.pexels.com")) {
      url.searchParams.set("auto", "compress");
      url.searchParams.set("cs", "tinysrgb");
      if (options.width) url.searchParams.set("w", String(options.width));
      url.searchParams.delete("dpr");
      return url.toString();
    }

    if (url.hostname.includes("dummyjson.com")) {
      if (options.width) url.searchParams.set("w", String(options.width));
      return url.toString();
    }

    return src;
  } catch {
    return src;
  }
}

export function buildImageSrcSet(
  src: string,
  widths: number[],
  options: Omit<ImageTransformOptions, "width"> = {},
) {
  if (!src || !isAbsoluteUrl(src)) {
    return undefined;
  }

  try {
    const hostname = new URL(src).hostname;
    if (!isKnownImageHost(hostname)) {
      return undefined;
    }
  } catch {
    return undefined;
  }

  const entries = widths
    .filter((width) => Number.isFinite(width) && width > 0)
    .map((width) => `${withImageParams(src, { ...options, width })} ${width}w`);

  return entries.length ? entries.join(", ") : undefined;
}

