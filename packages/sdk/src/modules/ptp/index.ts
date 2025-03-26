import { Base } from '../base';
import axios from 'axios';

export interface SyncResult {
  offset: bigint;
  synchronizedTime: bigint;
}

export interface PtpOptions {
  masterUrl: string;
  interval?: number; // in milliseconds, defaults to 1000
}

export class Ptp extends Base {
  private intervalId?: NodeJS.Timer;

  constructor() {
    super();
  }

  /**
   * Gets high-resolution timestamp in nanoseconds for both browser and Node.js
   * @returns BigInt timestamp in nanoseconds
   */
  private getNanoTimestamp(): bigint {
    return BigInt(Date.now()) * BigInt(1_000_000);
    // TODO: Implement process.hrtime for Node.js for exact NS timestamp
    /* if (typeof window !== 'undefined' && window.performance) {
      // Browser environment
      return BigInt(Date.now()) * BigInt(1_000_000);
    } else if (typeof process !== 'undefined' && process.hrtime) {
      // Node.js environment
      const unixMillis = Date.now();
      const hrTime = process.hrtime.bigint();
      const nodeUptime = process.uptime() * 1000; // uptime in milliseconds
      const uptimeMillisBigInt = BigInt(Math.floor(nodeUptime));
      const baseMillis = BigInt(unixMillis) - uptimeMillisBigInt;
      return (baseMillis * BigInt(1_000_000)) + (hrTime % BigInt(1_000_000));
    } else {
      // Fallback (less precise)
      return BigInt(Date.now()) * BigInt(1_000_000);
    } */
  }

  /**
   * Subscribes to time synchronization updates with a master clock
   * @param options - Configuration options for PTP synchronization
   * @param callback - Function to receive synchronization updates
   * @returns Function to unsubscribe from updates
   */
  public subscribe(
    options: PtpOptions,
    callback: (result: SyncResult) => void
  ): () => void {
    const { masterUrl, interval = 1000 } = options;

    // Initial sync
    this.synchronizeClock(masterUrl).then((result) => {
      if (result) {
        callback(result);
      }
    });

    // Periodic sync
    this.intervalId = setInterval(async () => {
      const result = await this.synchronizeClock(masterUrl);
      if (result) {
        callback(result);
      }
    }, interval);

    // Return unsubscribe function
    return () => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }
    };
  }

  /**
   * Performs a single clock synchronization with the master
   * @param masterUrl - URL of the master clock server
   * @returns Synchronization result containing offset and synchronized time
   */
  private async synchronizeClock(
    masterUrl: string
  ): Promise<SyncResult | undefined> {
    try {
      // Step 1: Sync Message
      const { data: syncData } = await axios.get(`${masterUrl}/sync`);
      const T1 = BigInt(syncData.T1);
      const T1_prime = this.getNanoTimestamp();

      // Step 2: Delay Request
      const T2 = this.getNanoTimestamp();
      const { data: delayData } = await axios.post(`${masterUrl}/delay_req`);
      const T2_prime = BigInt(delayData.T2_prime);

      // Step 3: Calculate offset
      const offset = (T1_prime - T1 - (T2 - T2_prime)) / BigInt(2);
      const synchronizedTime = T1_prime + offset;

      return { offset, synchronizedTime };
    } catch (error) {
      console.error('Error during synchronization:', error);
      return undefined;
    }
  }
}
