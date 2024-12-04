import dotenv from 'dotenv';
import { Main as SDK } from '../main';
import { ethers, toUtf8String} from 'ethers';

dotenv.config();

/**
 * Global variables used to initialize the BASE_URL, and seed phrases that are used to create wallets.
 * 
 * Address error used multiple times, so it is initialized here.
 */
const BASE_URL = process.env['BASE_URL'] as string;
const SEED = process.env['SEED'] as string;
const SEED2 = process.env['SEED2'] as string;
const ETH_PRIVATE2 = process.env['ETH_PRIVATE2'] as string;


/**
 * Tests functionality in the sdk for DID ethereum operations.
 * 
 * 
 */
describe('Ethereum Did', () => {
  let sdk: SDK;

  beforeAll(async () => {
    sdk = await SDK.createEth();
  }, 40000);

  afterAll(async () => {
  });

  /**
   * Tests the generation of a DID operations for ethereum tx values
   */
    describe('test ethereum did()', () => {
      it('test create did tx and send', async () => {

        // create transaction to send
        const tx = await sdk.did.create({name: 'test1', address: '0x48C9774C88736F7c169D2598278876727AFD3599'});
        expect(tx.to).toBe('0x0000000000000000000000000000000000000800');
        expect(tx.data).toMatch(/^0x([0-9a-fA-F]*)$/);

        // send transaction
        const provider = new ethers.WebSocketProvider(BASE_URL);
        const signer = new ethers.Wallet(ETH_PRIVATE2, provider);
        const response = await signer.sendTransaction(tx);

        // make sure the tx was sent to the right precompile from my address with the hex data
        expect(response.to).toBe('0x0000000000000000000000000000000000000800');
        expect(response.from).toBe('0x48C9774C88736F7c169D2598278876727AFD3599');
        expect(response.data).toMatch(/^0x([0-9a-fA-F]*)$/);

      }, 50000);
    })
  })