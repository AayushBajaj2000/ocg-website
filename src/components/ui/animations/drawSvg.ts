import { withBasePath } from "@/lib/assets";

/**
 * Shared plumbing for "hand-drawn" SVGs: fetch the markup once, inline it
 * safely, and prime every shape so a stroke-dashoffset animation can draw it.
 * Callers decide how the shapes animate (all at once, or one after another).
 */

export type DrawTarget = { el: SVGGeometryElement; fillOpacity: string; addedStroke: boolean };

const SHAPES = "path, circle, rect, ellipse, line, polyline, polygon";

export const DRAW_STYLES = [
  "stroke",
  "stroke-width",
  "stroke-dasharray",
  "stroke-dashoffset",
  "fill-opacity",
  "vector-effect",
];

export const DRAW_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

const svgCache = new Map<string, Promise<string>>();

export const loadSvg = (url: string): Promise<string> => {
  let request = svgCache.get(url);
  if (!request) {
    request = fetch(withBasePath(url)).then((res) =>
      res.ok ? res.text() : Promise.reject(new Error(`Failed to load ${url}`)),
    );
    request.catch(() => svgCache.delete(url));
    svgCache.set(url, request);
  }
  return request;
};

export const parseSvg = (markup: string, idPrefix: string): SVGSVGElement | null => {
  const root = new DOMParser().parseFromString(markup, "image/svg+xml").documentElement;
  if (root.nodeName !== "svg") return null;

  root.querySelectorAll("script, foreignObject").forEach((node) => node.remove());

  for (const el of [root, ...root.querySelectorAll("*")]) {
    for (const { name, value } of Array.from(el.attributes)) {
      const attr = name.toLowerCase();
      if (attr.startsWith("on")) el.removeAttribute(name);
      else if (attr === "id") el.setAttribute(name, `${idPrefix}${value}`);
      else if (attr === "href" || attr === "xlink:href") {
        if (value.startsWith("#")) el.setAttribute(name, `#${idPrefix}${value.slice(1)}`);
        else el.removeAttribute(name);
      } else if (value.includes("url(#")) {
        el.setAttribute(name, value.replaceAll("url(#", `url(#${idPrefix}`));
      }
    }
  }

  root.setAttribute("width", "100%");
  root.setAttribute("height", "100%");
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("focusable", "false");
  return document.importNode(root, true) as unknown as SVGSVGElement;
};

// Computed styles need the svg attached, so this runs after it is in the DOM.
export const hideShapes = (svg: SVGSVGElement): DrawTarget[] =>
  [...svg.querySelectorAll<SVGGeometryElement>(SHAPES)]
    .filter((el) => !el.closest("defs, clipPath, mask, pattern, symbol"))
    .map((el) => {
      const { fill, stroke, fillOpacity } = getComputedStyle(el);
      const addedStroke = stroke === "none";
      el.setAttribute("pathLength", "1");
      if (addedStroke) {
        el.style.setProperty("stroke", fill === "none" ? "currentColor" : fill);
        el.style.setProperty("stroke-width", "1");
        el.style.setProperty("vector-effect", "non-scaling-stroke");
      }
      el.style.setProperty("stroke-dasharray", "1");
      el.style.setProperty("stroke-dashoffset", "1");
      el.style.setProperty("fill-opacity", "0");
      return { el, fillOpacity, addedStroke };
    });

/** Stroke traces in over the first 60%, then the fill settles in. */
export const drawKeyframes = ({ fillOpacity, addedStroke }: DrawTarget): Keyframe[] => [
  { strokeDashoffset: "1", fillOpacity: "0", strokeOpacity: "1" },
  { strokeDashoffset: "0", fillOpacity: "0", strokeOpacity: "1", offset: 0.6 },
  { strokeDashoffset: "0", fillOpacity, strokeOpacity: addedStroke ? "0" : "1" },
];
