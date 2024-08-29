// Define CreateDidError as a child of the built-in Error class
export class CreateDidError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'CreateDidError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}

// Define NameError as a child of CreateDidError
export class NameError extends CreateDidError {
  constructor(message: string) {
    super(message);
    this.name = 'NameError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Define NameError as a child of CreateDidError
export class SeedError extends CreateDidError {
  constructor(message: string) {
    super(message);
    this.name = 'SeedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Define AddressError as a child of CreateDidError
export class AddressError extends CreateDidError {
  constructor(message: string) {
    super(message);
    this.name = 'AddressError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}


// Define CreateDidError as a child of the built-in Error class
export class ReadDidError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'ReadDidError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}

// Define CreateDidError as a child of the built-in Error class
export class UpdateDidError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'UpdateDidError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}

// Define CreateDidError as a child of the built-in Error class
export class NoCustomFieldsError extends UpdateDidError {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'NoCustomFieldsError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}

// Define CreateDidError as a child of the built-in Error class
export class DidNotFoundError extends UpdateDidError {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'DidNotFoundError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}

// Define CreateDidError as a child of the built-in Error class
export class RemoveDidError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error class
    this.name = 'RemoveDidError'; // Set the name property to the custom error type
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}