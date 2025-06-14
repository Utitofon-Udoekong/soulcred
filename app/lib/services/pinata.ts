import { PinataSDK } from "pinata";
import { ResumeMetadata } from '../types';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

/**
 * Service for interacting with IPFS via Pinata
 */
export class PinataService {
  private static instance: PinataService;
  private pinata: PinataSDK | null = null;
  private initialized = false;

  private constructor() { }

  /**
   * Get the singleton instance of the Pinata service
   */
  public static getInstance(): PinataService {
    if (!PinataService.instance) {
      PinataService.instance = new PinataService();
    }
    return PinataService.instance;
  }

  /**
   * Initialize the Pinata client
   */
  public async initialize(): Promise<void> {
    if (!this.pinata) {
      this.pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
      });
      this.initialized = true;
    }
  }

  /**
   * Compress a file before uploading
   * @param file - The file to compress
   * @returns The compressed file
   */
  private async compressFile(file: File): Promise<File> {
    // If it's an image, use browser-image-compression
    if (file.type.startsWith('image/')) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, { type: file.type });
    }
    
    return file;
  }

  /**
   * Upload a file to IPFS using Pinata
   * @param file - The file to upload
   * @returns The IPFS URI for the uploaded file
   */
  public async uploadFile(file: File): Promise<string> {
    if (!this.pinata) throw new Error('Pinata client not initialized');
    
    // Compress the file first
    const compressedFile = await this.compressFile(file);
    
    // Create a unique filename using UUID and original filename
    const extension = file.name.split('.').pop() || '';
    const filename = `${uuidv4()}_${Date.now()}.${extension}`;
    const newFile = new File([compressedFile], filename, { type: file.type });
    
    const { cid } = await this.pinata.upload.public.file(newFile);
    return await this.pinata.gateways.public.convert(cid);
  }

  /**
   * Upload resume metadata to IPFS using Pinata
   * @param metadata - The resume metadata to upload
   * @returns The IPFS URI for the uploaded metadata
   */
  public async uploadResumeMetadata(metadata: ResumeMetadata): Promise<string> {
    if (!this.pinata) throw new Error('Pinata client not initialized');
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    // Create a unique filename using UUID and timestamp
    const filename = `resume_${uuidv4()}_${Date.now()}.json`;
    const file = new File([blob], filename, { type: 'application/json' });
    const { cid } = await this.pinata.upload.public.file(file);
    return await this.pinata.gateways.public.convert(cid);
  }

  /**
   * Get HTTP URL from IPFS URI
   * @param ipfsUri - The IPFS URI (ipfs://...)
   * @returns HTTP URL for the IPFS content
   */
  public getHttpUrl(ipfsUri: string): string {
    if (!ipfsUri) return '';
    if (ipfsUri.startsWith('http')) return ipfsUri;
    if (ipfsUri.startsWith('data:')) return ipfsUri;
    if (ipfsUri.startsWith('ipfs://')) {
      const cid = ipfsUri.replace('ipfs://', '');
      return `https://${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`;
    }
    return ipfsUri;
  }

  /**
   * Get resume metadata from IPFS URI
   * @param ipfsUri - The IPFS URI (ipfs://...)
   * @returns The resume metadata
   */
  public async getResumeMetadata(ipfsUri: string): Promise<ResumeMetadata> {
    if (!ipfsUri) throw new Error('No IPFS URI provided');

    const httpUrl = this.getHttpUrl(ipfsUri);
    const response = await fetch(httpUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch resume metadata: ${response.statusText}`);
    }

    const metadata = await response.json();
    return metadata as ResumeMetadata;
  }
}

// Export a singleton instance
export const pinataService = PinataService.getInstance(); 