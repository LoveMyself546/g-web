# G-Web

A Logitech™ device manager in browsers. It uses WebHID API to interact with devices connected via USB (corded or through receivers) or Bluetooth.

G-Web is not a official product of Logitech.

Current state:

![image](doc/screenshot.png)

## Limitations

1. Due to security concerns, it can't detect and connect to devices automatically. Users must select their devices from a browser-provided popup to permit the connection.
2. Because it runs in browser, it won't support certain custom key mapping features (divert mode) like macro or launching programs.

## Roadmap

### General

- [x] Device name
- [x] Device type
- [x] Battery level
  - [x] 0x1000
  - [x] 0x1001
  - [x] 0x1004
  - [x] 0x1f20

### Receiver

- [x] List connected devices
- [ ] List paired devices
- [ ] Pair new devices

### Mouse

- [x] DPI
- [x] Report rate
- [ ] Button remapping
- [ ] Gesture
- [ ] **R!G!B!**

### Keyboard

> I don't have a Logitech keyboard so no feature planned.

## Thanks

* http://drive.google.com/folderview?id=0BxbRzx7vEV7eWmgwazJ3NUFfQ28: Logitech Official Documentations
* [pwr-Solaar/Solaar](https://github.com/pwr-Solaar/Solaar): A Logitech device manager for Linux.
* [cvuchener/hidpp](https://github.com/cvuchener/hidpp): Collection of HID++ tools
