import { type VanyUploadContext } from './VanyUploadContext';

/**
 * Common uploading function
 */
export type VanyUploadFunction<T> = (context: VanyUploadContext) => Promise<T>;