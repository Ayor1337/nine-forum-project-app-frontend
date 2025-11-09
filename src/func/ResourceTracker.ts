type EventTargetLike = Window | Document | HTMLElement | SVGElement | Node;

type CleanupSummary = {
  scripts: number;
  links: number;
  images: number;
  timeouts: number;
  intervals: number;
  events: number;
  abortControllers: number;
  xhrs: number;
};

export class ResourceTracker {
  private scripts = new Set<HTMLScriptElement>();
  private links = new Set<HTMLLinkElement>();
  private images = new Set<HTMLImageElement>();
  private timeouts = new Set<number>();
  private intervals = new Set<number>();
  private events = new Set<{
    target: EventTargetLike;
    type: string;
    handler: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
  }>();
  private abortControllers = new Set<AbortController>();
  private xhrs = new Set<XMLHttpRequest>();

  addScript(src: string, attrs?: Partial<HTMLScriptElement>) {
    const s = document.createElement("script");
    s.src = src;
    s.async = attrs?.async ?? false;
    s.defer = attrs?.defer ?? false;
    if (attrs?.type) s.type = attrs.type;
    s.dataset.tracked = "true";
    document.head.appendChild(s);
    this.scripts.add(s);
    return s;
  }

  addLink(href: string, rel: string = "stylesheet") {
    const l = document.createElement("link");
    l.rel = rel;
    l.href = href;
    l.dataset.tracked = "true";
    document.head.appendChild(l);
    this.links.add(l);
    return l;
  }

  createImage(src?: string) {
    const img = new Image();
    if (src) img.src = src;
    this.images.add(img);
    return img;
  }

  setTimeout(handler: (...args: any[]) => void, timeout?: number, ...args: any[]) {
    const id = window.setTimeout(handler, timeout, ...args);
    this.timeouts.add(id);
    return id;
  }

  setInterval(handler: (...args: any[]) => void, timeout?: number, ...args: any[]) {
    const id = window.setInterval(handler, timeout, ...args);
    this.intervals.add(id);
    return id;
  }

  addEventListener(
    target: EventTargetLike,
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    target.addEventListener(type, handler as EventListener, options as any);
    this.events.add({ target, type, handler, options });
    return () => {
      target.removeEventListener(type, handler as EventListener, options as any);
      // Remove the record from set by finding the same reference
      for (const ev of this.events) {
        if (ev.target === target && ev.type === type && ev.handler === handler) {
          this.events.delete(ev);
          break;
        }
      }
    };
  }

  trackAbortController(controller?: AbortController) {
    const c = controller ?? new AbortController();
    this.abortControllers.add(c);
    return c;
  }

  fetchWithAbort(input: RequestInfo | URL, init: RequestInit = {}) {
    const controller = this.trackAbortController();
    const signal = controller.signal;
    const p = fetch(input, { ...init, signal });
    return { promise: p, controller };
  }

  axiosWithAbort<T = any>(
    axiosInstance: any,
    config: Record<string, any>
  ): { promise: Promise<T>; controller: AbortController } {
    const controller = this.trackAbortController();
    const promise = axiosInstance({ ...config, signal: controller.signal });
    return { promise, controller };
  }

  trackXHR(xhr: XMLHttpRequest) {
    this.xhrs.add(xhr);
    return xhr;
  }

  cleanup(extra?: { removeDomIds?: string[] }) {
    // Abort pending requests
    this.abortControllers.forEach((c) => {
      try {
        c.abort();
      } catch {}
    });
    this.abortControllers.clear();

    // Abort XHRs
    this.xhrs.forEach((x) => {
      try {
        x.abort();
      } catch {}
    });
    this.xhrs.clear();

    // Clear timers
    this.timeouts.forEach((id) => clearTimeout(id));
    this.intervals.forEach((id) => clearInterval(id));
    this.timeouts.clear();
    this.intervals.clear();

    // Remove event listeners
    this.events.forEach(({ target, type, handler, options }) => {
      try {
        target.removeEventListener(type, handler as EventListener, options as any);
      } catch {}
    });
    this.events.clear();

    // Remove dynamic CSS/JS tags
    this.scripts.forEach((s) => {
      try {
        s.parentNode?.removeChild(s);
      } catch {}
    });
    this.links.forEach((l) => {
      try {
        l.parentNode?.removeChild(l);
      } catch {}
    });
    this.scripts.clear();
    this.links.clear();

    // Release images
    this.images.forEach((img) => {
      try {
        img.onload = null;
        img.onerror = null;
        // Revoke object URLs if any
        if (img.src.startsWith("blob:")) URL.revokeObjectURL(img.src);
        img.src = "";
      } catch {}
    });
    this.images.clear();

    // Remove extra DOM nodes by id (e.g., widgets inserted into body)
    extra?.removeDomIds?.forEach((id) => {
      const el = document.getElementById(id);
      try {
        el?.parentNode?.removeChild(el);
      } catch {}
    });
  }

  verify(): CleanupSummary {
    const summary: CleanupSummary = {
      scripts: this.scripts.size,
      links: this.links.size,
      images: this.images.size,
      timeouts: this.timeouts.size,
      intervals: this.intervals.size,
      events: this.events.size,
      abortControllers: this.abortControllers.size,
      xhrs: this.xhrs.size,
    };
    const leftover = Object.entries(summary).filter(([, v]) => v > 0);
    if (leftover.length > 0) {
      console.warn(
        "[ResourceTracker] 清理后仍有残留资源:",
        Object.fromEntries(leftover)
      );
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log("[ResourceTracker] 所有资源已正确释放");
      }
    }
    return summary;
  }
}

import { useEffect, useRef } from "react";

export function useResourceTracker() {
  const ref = useRef<ResourceTracker | null>(null);
  if (!ref.current) ref.current = new ResourceTracker();

  useEffect(() => {
    return () => {
      // 针对全局 Live2D 挂载的节点进行额外移除，防止遗留
      ref.current?.cleanup({
        removeDomIds: [
          "waifu",
          "waifu-toggle",
          "waifu-canvas",
          "waifu-tool",
          "waifu-tips",
        ],
      });
      ref.current?.verify();
    };
  }, []);

  return ref.current!;
}