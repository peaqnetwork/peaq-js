// DID custom errors

export class GenerateDidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenerateDidError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class CreateDidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CreateDidError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NameError extends CreateDidError {
  constructor(message: string) {
    super(message);
    this.name = 'NameError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SeedError extends CreateDidError {
  constructor(message: string) {
    super(message);
    this.name = 'SeedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AddressError extends CreateDidError {
  constructor(message: string) {
    super(message);
    this.name = 'AddressError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ReadDidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReadDidError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UpdateDidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpdateDidError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoCustomFieldsError extends UpdateDidError {
  constructor(message: string) {
    super(message);
    this.name = 'NoCustomFieldsError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DidNotFoundError extends UpdateDidError {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'DidNotFoundError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}

export class RemoveDidError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'RemoveDidError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}




// Storage Custom Errors
export class StorageError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'StorageError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}


// Define CreateDidError as a child of the built-in Error class
export class ItemTypeError extends StorageError {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'ItemTypeError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}

// Define CreateDidError as a child of the built-in Error class
export class ItemError extends StorageError {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'ItemError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}

// Define CreateDidError as a child of the built-in Error class
export class StorageAddressError extends StorageError {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'StorageAddressError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}
// Define CreateDidError as a child of the built-in Error class
export class StorageSeedError extends StorageError {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'StorageSeedError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}