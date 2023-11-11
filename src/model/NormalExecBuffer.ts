export default class NormalExecBuffer {
  command: string
  iterations: string
  constructor() {
    this.command = ''
    this.iterations = ''
  }

  /**
   * Modifies the command and iterations buffers in place.
   * @param {string} c
   * @returns {void}
   */
  public append(c: string): void {
    if (
      this.command.length > 3 ||
      (this.command.length == 3 &&
        !(this.command[0] == 'c' || this.command[0] == 'y'))
    ) {
      this.erase()
    }
    if (this.command[0] == '0') {
      this.erase()
    }
    if (this.isNumericChar(c)) {
      if (this.iterations.length && this.command.length) {
        this.erase()
      }
      if (this.iterations.length == 0 && c == '0') {
        this.command = this.command.concat('0')
      } else {
        this.iterations = this.iterations.concat(c)
      }
    } else {
      this.command = this.command.concat(c)
    }
  }

  private isNumericChar(c: string): boolean {
    return c >= '0' && c <= '9'
  }

  public erase() {
    this.command = ''
    this.iterations = ''
  }

  public getIterations(): number {
    return this.iterations.length > 0 ? parseInt(this.iterations) : 1
  }

  public getCommand(): string {
    return this.command
  }

  public toString(): string {
    return `Command : ${this.command}, Iterations : ${this.iterations}`
  }
}
