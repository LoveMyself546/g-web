import { Hidpp } from "./hidpp";

export class AdjustableDpi {
  public hidpp: Hidpp;

  constructor(hidpp: Hidpp) {
    this.hidpp = hidpp;
  }

  public async getDpiList(): Promise<number[]> {
    await this.hidpp.getVersion();

    if (this.hidpp.version === 1) {
      throw new Error('Not Implemented');
    } else {
      const featureIndex = await this.hidpp.getFeatureIndex(0x2201);
      const response = await this.hidpp.request(
        0x11,
        featureIndex,
        0x1 // GetSensorDpiList
      );
      const view = new DataView(response);
      let list: number[] = [];
      let step: number | undefined;
      for (let i = 1; i <= 1 + 14; i += 2) {
        const value = view.getUint16(i);
        if (value === 0) {
          break;
        }
        if (value >> 13 === 0b111) {
          step = value & 0x1fff;
          continue;
        }
        list.push(value & 0x1fff);
      }
      if (step) {
        const result: number[] = [];
        for (let i = list[0]; i <= list[1]; i += step) {
          result.push(i);
        }
        return result;
      } else {
        return list;
      }
    }
  }

  public async getDpi(): Promise<number> {
    await this.hidpp.getVersion();

    if (this.hidpp.version === 1) {
      throw new Error('Not Implemented');
    } else {
      const featureIndex = await this.hidpp.getFeatureIndex(0x2201);
      const response = await this.hidpp.request(
        0x11,
        featureIndex,
        0x2 // GetSensorDpi
      );
      const view = new DataView(response);
      return view.getUint16(1); // SensorId, DpiMSB, DpiLSB
    }
  }

  public async setDpi(value: number): Promise<number> {
    await this.hidpp.getVersion();

    if (this.hidpp.version === 1) {
      throw new Error('Not Implemented');
    } else {
      const featureIndex = await this.hidpp.getFeatureIndex(0x2201);
      const data = new ArrayBuffer(3);
      let view = new DataView(data);
      view.setUint16(1, value);
      const response = await this.hidpp.request(
        0x11,
        featureIndex,
        0x3, // SetSensorDpi
        data
      );
      view = new DataView(response);
      return view.getUint16(1); // SensorId, DpiMSB, DpiLSB
    }
  }
}