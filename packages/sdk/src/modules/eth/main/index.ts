import { Base } from '../../base';
import { Eth_Did } from '../did';


/**
 * Main class for interacting with the SDK on the Ethereum side.
 */
export class Main extends Base {
// TODO add rbac and storage when developed
  public did: Eth_Did;

  constructor() {
    super();
    this.did = new Eth_Did();
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
