export class Cancel {
  __CANCEL__ = true

  constructor(public message?: string) {}

  toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '')
  }
}
