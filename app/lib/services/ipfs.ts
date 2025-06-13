import { create, Client } from '@web3-storage/w3up-client';
import { ResumeMetadata } from '../types';

/**
 * Service for interacting with IPFS via Web3.Storage (w3up-client only)
 */
export class IPFSService {
  private static instance: IPFSService;
  private web3StorageClient: Client | null = null;
  private initialized = false;
  private spaceProvisioned = false;
  private account: any;

  private constructor() { }

  /**
   * Get the singleton instance of the IPFS service
   */
  public static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService();
    }
    return IPFSService.instance;
  }

  /**
   * Initialize the Web3.Storage client, login, and provision/set a space.
   * If email and spaceName are provided, will login and create/set space if needed.
   * If spaceDid is provided, will set the existing space as current.
   */
  public async initialize({ email, spaceName, spaceDid }: { email?: string, spaceName?: string, spaceDid?: string } = {}): Promise<void> {
    if (!this.web3StorageClient) {
      this.web3StorageClient = await create();
    }

    // If a space DID is provided, just set it as current
    // if (spaceDid) {
    //   await this.initializeWithExistingSpace(spaceDid);
    //   return;
    // }

    // If not logged in and email is provided, login
    if (!this.account && email) {
      await this.login(email);
    }

    // If not provisioned and we have an account and spaceName, create and set space
    if (!this.spaceProvisioned && this.account && spaceName) {
      await this.createAndSetSpace(spaceName);
    }
  }

  /**
   * Login the agent with an email address (sends confirmation email)
   */
  public async login(email: string): Promise<void> {
    if (!this.web3StorageClient) {
      this.web3StorageClient = await create();
    }
    try {
      this.account = await this.web3StorageClient.login(email as `${string}@${string}`);
      // Wait for payment plan selection (poll every 1s, timeout 15min)
      await this.account.plan.wait();
    } catch (error) {
      console.error('Web3.Storage login failed:', error);
      throw error;
    }
  }

  /**
   * Create and provision a new space, and set it as current
   */
  public async createAndSetSpace(spaceName: string): Promise<void> {
    if (!this.web3StorageClient || !this.account) {
      throw new Error('Web3.Storage client or account not initialized. Call login() first.');
    }
    try {
      const space = await this.web3StorageClient.createSpace(spaceName, { account: this.account });
      await this.web3StorageClient.setCurrentSpace(space.did());
      this.spaceProvisioned = true;
    } catch (error) {
      console.error('Error creating/provisioning Web3.Storage space:', error);
      throw error;
    }
  }

  /**
   * Initialize the Web3.Storage client and set current space if already provisioned
   * (Call login and createAndSetSpace separately for new users)
   */
  public async initializeWithExistingSpace(spaceDid: string): Promise<void> {
    if (!this.web3StorageClient) {
      this.web3StorageClient = await create();
    }
    try {
      await this.web3StorageClient.setCurrentSpace(spaceDid as `did:${string}:${string}`);
      this.spaceProvisioned = true;
    } catch (error) {
      console.error('Error setting current Web3.Storage space:', error);
      throw error;
    }
  }

  /**
   * Upload a file to IPFS using web3StorageClient
   * @param file - The file to upload`
   * @returns The IPFS URI for the uploaded file
   */
  public async uploadFile(file: File): Promise<string> {
    if (!this.web3StorageClient) throw new Error('Web3.Storage client not initialized');
    const cid = await this.web3StorageClient.uploadFile(file);
    return `ipfs://${cid}`;
  }

  /**
   * Upload multiple files as a directory to IPFS using web3StorageClient
   * @param files - Array of files to upload
   * @returns The IPFS URI for the uploaded directory
   */
  public async uploadDirectory(files: File[]): Promise<string> {
    if (!this.web3StorageClient) throw new Error('Web3.Storage client not initialized');
    const cid = await this.web3StorageClient.uploadDirectory(files);
    return `ipfs://${cid}`;
  }

  /**
   * Upload resume metadata to IPFS using web3StorageClient
   * @param metadata - The resume metadata to upload
   * @returns The IPFS URI for the uploaded metadata
   */
  public async uploadResumeMetadata(metadata: ResumeMetadata): Promise<string> {
    if (!this.web3StorageClient) throw new Error('Web3.Storage client not initialized');
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    // web3StorageClient.uploadFile expects a File, so we create one
    const file = new File([blob], 'resume.json', { type: 'application/json' });
    const cid = await this.web3StorageClient.uploadFile(file);
    return `ipfs://${cid}`;
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
      return `https://${cid}.ipfs.w3s.link`;
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
export const ipfsService = IPFSService.getInstance(); 