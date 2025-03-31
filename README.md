# peaq-js

Follow [documentation](https://docs.peaq.network/docs/build/sdk/) for a detailed overview of the features and functionalities of peaq SDK.


## Edit functions
The SDK acts as a wrapper class that abstracts away calls to our substrate based blockchain

Go to /packages/sdk/src/modules to see backend code
- **main:** Creates an instance, connects/disconnects to chain, and stores metadata
- **base:** Stores important multi use variables and performs generic blockchain operations
- **did:** Class where did's are created, removed, read, and updated
- **rbac:** Class where role-based access control is called

## Test
1. Go to proper directory with cmd `cd packages/sdk`
2. Create a .env file in `packages/sdk` to store the base_url (network) you are testing, and seed phrases that connect to funded wallets that are needed to execute transactions.
3. Run the tests with the cmd `npx nx test`
