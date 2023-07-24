interface IErrors {
  name: string;
  message: string;
  kind: string;
  path: string;
  properties: Record<string, unknown>;
}

type ErrorObject = {
  [prop: string]: IErrors;
};

export interface ValidationException {
  errors: ErrorObject;
  name: string;
  _message: string;
  message: string;
}
