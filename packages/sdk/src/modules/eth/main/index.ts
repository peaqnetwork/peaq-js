import { Base } from '../../base';
import { Did } from '../did';


/**
 * Main class for interacting with the SDK on the Ethereum side.
 */
export class Main extends Base {
  public did: Did;

  constructor() {
    super();
    this.did = new Did();
  }


    /**
     * Creates a new instance of the Ethereum's main class to call DID operations.
     *
     * @param
     * @returns The callable sdk methods.
     */
    public static async createEth() {
        const sdk = new Main();
        return sdk;
        }

}
