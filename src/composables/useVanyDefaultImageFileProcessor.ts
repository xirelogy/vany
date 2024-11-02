import {
  xw,
} from '@xirelogy/xwts';

import { type VanyUploadContext } from '../types/VanyUploadContext';
import { type VanyUploadFunction } from '../types/VanyUploadFunction';



/**
 * Common size data
 */
interface Size {
  /**
   * Width
   */
  width: number;
  /**
   * Height
   */
  height: number;
}


/**
 * Select a proper scale
 * @param wScale
 * @param hScale
 */
function selectScale(wScale: number|undefined, hScale: number|undefined): number|undefined {
  const isWScaleDefined = wScale !== undefined;
  const isHScaleDefined = hScale !== undefined;

  // If both defined, select the bigger one
  if (isWScaleDefined && isHScaleDefined) return Math.max(wScale as number, hScale as number);

  // If only one defined, then return the defined one
  if (isWScaleDefined && !isHScaleDefined) return wScale;
  if (!isWScaleDefined && isHScaleDefined) return hScale;

  // Otherwise undefined
  return undefined;

}


/**
 * Calculate the adapted size for given image and size preference
 * @param image
 * @param setWidth
 * @param setHeight
 * @returns
 */
function calculateAdaptSize(image: HTMLImageElement, setWidth: number|undefined, setHeight: number|undefined): Size {
  const wScale = setWidth !== undefined ? setWidth / image.width : undefined;
  const hScale = setHeight !== undefined ? setHeight / image.height : undefined;
  const scale = selectScale(wScale, hScale);

  // When undefined, return ad-verbatim
  if (scale === undefined) return {
    width: image.width,
    height: image.height,
  }

  // Decide on new width/height
  let newWidth = Math.floor(image.width * scale);
  let newHeight = Math.floor(image.height * scale);
  if (setWidth !== undefined && newWidth < setWidth) newWidth = setWidth;
  if (setHeight !== undefined && newHeight < setHeight) newHeight = setHeight;

  return {
    width: newWidth,
    height: newHeight,
  };
}


/**
 * Options to useVanyDefaultImageFileProcessor()
 */
interface VanyDefaultImageFileProcessorOptions {
  /**
   * Uploader function
   * @param src Source URL/data-URL to be uploaded
   * @returns Resulting URL after upload
   */
  uploader: (src: string) => Promise<string>;
  /**
   * Preferred width
   * @defaultValue undefined
   */
  width?: number;
  /**
   * Preferred height
   * @defaultValue undefined
   */
  height?: number;
  /**
   * Preferred image type
   * @defaultValue undefined
   */
  imageType?: string;
  /**
   * Preferred compression quality
   * @defaultValue 0.7
   */
  quality?: number;
}


/**
 * Create an instance of uploader using specific options
 * @param options
 * @returns
 */
export function useVanyDefaultImageFileProcessor(options: VanyDefaultImageFileProcessorOptions): VanyUploadFunction<string> {
  const _prefWidth = options?.width;
  const _prefHeight = options?.height;
  const _prefImageType = options?.imageType;
  const _prefQuality = options?.quality ?? 0.7;

  const adapter = async (srcUrl: string): Promise<string> => {
      // Shortcut exit function
      if (options.width === undefined
        && options.height === undefined
        && options.imageType === undefined
        && options.quality === undefined
      ) return srcUrl;

      const image = await xw.loadImage(srcUrl);
      const adapted = calculateAdaptSize(image, _prefWidth, _prefHeight);

      const outWidth = _prefWidth ?? adapted.width;
      const outHeight = _prefHeight ?? adapted.height;

      const newX = 0 - Math.floor((adapted.width - outWidth) / 2);
      const newY = 0 - Math.floor((adapted.height - outHeight) / 2);

      // Draw and return
      const canvas = document.createElement('canvas');
      canvas.width = outWidth;
      canvas.height = outHeight;

      const context = canvas.getContext('2d');
      if (!context) return '';  // Bad return

      context.drawImage(image, newX, newY, adapted.width, adapted.height);
      return canvas.toDataURL(_prefImageType, _prefQuality);
  };

  return async (context: VanyUploadContext): Promise<string> => {
      // Process into URL
      const fileContent = await xw.readFileAsDataUrl(context.file);

      // Adapted
      const adaptedUrl = await adapter(fileContent.data);

      // And upload
      return await options.uploader(adaptedUrl);
  };
}