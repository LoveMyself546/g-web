import { EventEmitter, Event } from '@yume-chan/event';

import { Hidpp } from "./hidpp";

export class Receiver {
  hidpp: Hidpp;

  private children: Hidpp[] = [];

  private childAddedEvent = new EventEmitter<Hidpp>();
  public readonly onChildAdded = this.childAddedEvent.event;

  constructor(hidpp: Hidpp) {
    this.hidpp = hidpp;
    this.hidpp.device.addEventListener('inputreport', this.handleInputReport);
  }

  private handleInputReport = ({ data }: HIDInputReportEvent) => {
    const view = new Uint8Array(data.buffer);

    const deviceIndex = view[0];
    if (deviceIndex !== 0xff) {
      const command = view[1];
      if (command === 0x41) {
        // Device connected
        this.childAddedEvent.fire(this.getChild(deviceIndex));
        return;
      }

      this.children[deviceIndex]?.handleInputReport({ data });
    } else {
      const command = view[1];
      const address = view[2];
      const slice = data.buffer.slice(3);
      console.log(
        `raw message ${deviceIndex} 0x${command.toString(16).padStart(2, '0')} 0x${address.toString(16).padStart(2, '0')}`,
        Array.from(new Uint8Array(slice))
      );
    }
  };

  public async getChildCount(): Promise<number> {
    await this.hidpp.getVersion();
    if (this.hidpp.version !== 1) {
      throw new Error('Unsupported version');
    }

    const response = await this.hidpp.request(
      0x10,
      0x81,
      0x02,
    );
    const view = new Uint8Array(response);

    return view[1];
  }

  public async detectChildren() {
    await this.hidpp.request(
      0x10,
      0x80,
      0x02,
      new Uint8Array([0x02]).buffer
    );
  }

  public getChild(index: number): Hidpp {
    if (!this.children[index]) {
      this.children[index] = new Hidpp(this.hidpp.device, index, this.hidpp);
    }

    return this.children[index];
  }
}
