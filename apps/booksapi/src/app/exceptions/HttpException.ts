class HttpException extends Error {
  status: number;
  message: string;
  type: string;
  constructor(status: number, message: string, type: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.type = type;
  }
}

export default HttpException;
