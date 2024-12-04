import dotenv from 'dotenv';
import { Main as SDK } from '../main';

dotenv.config();

/**
 * Global variables used to initialize the BASE_URL, and seed phrases that are used to create wallets.
 * 
 * Address error used multiple times, so it is initialized here.
 */
const BASE_URL = process.env['BASE_URL'] as string;
const SEED = process.env['SEED'] as string;
const SEED2 = process.env['SEED2'] as string;

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
      it('test create did tx', async () => {
      }, 50000);
    })
  })