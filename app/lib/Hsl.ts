export default class Hsl {
  constructor(public h: number, public s: number, public l: number) {
    this.h = h;
    this.s = s;
    this.l = l;
  }

  get str() {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }

  get textColor() {
    const l = this.l > 50 ? 10 : 90;
    const s = this.s > 50 ? 40 : 60;
    return new Hsl(this.h, s, l);
  }

  get darker() {
    return new Hsl(this.h, this.s, this.l - 15);
  }
}
