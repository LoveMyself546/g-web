import { Hidpp } from "./hidpp";

export class ReportRate {
  hidpp: Hidpp;

  constructor(hidpp: Hidpp) {
    this.hidpp = hidpp;
  }

  async getReportRateList(): Promise<number[]> {
    const featureIndex = await this.hidpp.getFeatureIndex(0x8060);
    const response = await this.hidpp.request(
      0x11,
      featureIndex,
      0x0
    );
    const view = new Uint8Array(response);
    const byte = view[0];
    const result: number[] = [];
    for (let i = 0; i < 8; i += 1) {
      if (byte & (1 << i)) {
        result.push(i + 1);
      }
    }
    return result;
  }

  async getReportRate(): Promise<number> {
    const featureIndex = await this.hidpp.getFeatureIndex(0x8060);
    const response = await this.hidpp.request(
      0x11,
      featureIndex,
      0x1
    );
    const view = new Uint8Array(response);
    return view[0];
  }

  async setReportRate(value: number): Promise<void> {
    const featureIndex = await this.hidpp.getFeatureIndex(0x8060);
    await this.hidpp.request(
      0x11,
      featureIndex,
      0x2,
      new Uint8Array([value])
    );
  }
}