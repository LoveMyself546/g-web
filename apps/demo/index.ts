import { Hidpp2Feature, Hidpp1, Hidpp1ReceiverDeviceRegister, Hidpp1ReceiverRegister, Hidpp1Register, requestDevice, Hidpp2Function } from '@yume-chan/hidpp';

document.getElementById('select-button').onclick = async () => {

  const device = await requestDevice();
  console.log(device);
  if (device instanceof Hidpp1) {
    console.log('is hidpp1');

    console.log('notifications', await device.read(Hidpp1Register.Notifications, undefined));
    console.log('receiver information', await device.readReceiverRegister(Hidpp1ReceiverRegister.ReceiverInformation, undefined));

    const connectionState = await device.read(Hidpp1Register.ConnectionState, undefined);
    console.log('connectionState', connectionState);
    for (let i = 0; i < 7; i += 1) {
      if (connectionState.receiverState & (1 << i)) {
        console.log('device', i, 'connected');
        console.log('pairing information', await device.readReceiverDeviceRegister(Hidpp1ReceiverDeviceRegister.PairingInformation, i));
        console.log('extended pairing information', await device.readReceiverDeviceRegister(Hidpp1ReceiverDeviceRegister.ExtendedPairingInformation, i));
        console.log('device name', await device.readReceiverDeviceRegister(Hidpp1ReceiverDeviceRegister.DeviceName, i));
      }
    }
  } else {
    console.log('protocol version', await device.send(Hidpp2Function[Hidpp2Feature.Root].GetProtocolVersion, { unused1: 0, unused2: 0, pingData: 0x55 }));
    console.log('feature set index', await device.send(Hidpp2Function[Hidpp2Feature.Root].GetFeature, { feature: Hidpp2Feature.FeatureSet }));
    const count = await device.getFeatureCount();
    console.log('feature count', count);
    for (let i = 0; i <= count; i += 1) {
      console.log('feature at index', i, 'is 0x', (await device.getFeatureId(i)).toString(16));
    }

  }
};