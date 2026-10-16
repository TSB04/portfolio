declare module "page-flip" {
  type Corner = "top" | "bottom";
  interface PageFlipSettings {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    usePortrait?: boolean;
    drawShadow?: boolean;
    flippingTime?: number;
    autoSize?: boolean;
    disableFlipByClick?: boolean;
    showPageCorners?: boolean;
    startZIndex?: number;
  }
  export class PageFlip {
    constructor(parent: HTMLElement, settings: PageFlipSettings);
    loadFromHTML(pages: HTMLElement[]): void;
    on(eventName: "flip", callback: (event: { data: number }) => void): void;
    flip(page: number, corner: Corner): void;
    flipNext(corner: Corner): void;
    flipPrev(corner: Corner): void;
    getCurrentPageIndex(): number;
    update(): void;
    updateFromHtml(pages: HTMLElement[]): void;
    turnToPage(index: number): void;
    getSettings(): PageFlipSettings;
    getOrientation(): "portrait" | "landscape";
    on(eventName: "changeState", callback: (event: { data: string }) => void): void;
    destroy(): void;
  }
}