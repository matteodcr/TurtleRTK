# :turtle: Turtle RTK 

Turtle RTK is a GNSS RTK client built with React Native and TypeScript. It enables connection to a base station via an NTRIP Caster to transmit RTCM data to a rover in order to receive NMEA messages.
## Table of Contents

- [Installation](#installation)
- [Functionalities](#functionalities)
- [Contributing](#contributing)
- [License](#-license-mit)

## Installation

The app is currently available only on Android. You can get the latest release [here](https://github.com/matteodcr/TurtleRTK/releases). 
> For iOS, it is possible to have a functional version within a few hours of debugging.

## Functionalities

### Caster Protocols

| **Caster Protocol** | **Supported** |
|:---------------:|:---------:|
|     NTRIPv1     |     ✅     |
|     NTRIPv2     |     ✅     |

### Communication with Rover
| **Protocol** | **Supported** |  **Tested devices**  |
|:------------:|:-------------:|:--------------------:|
|      BLE     |       ✅       | SparkFun RTK Express |
|  Bluethooth  |       ❌       |           -          |
|      USB     |       ❌       |           -          |


## Contributing

To start developing, you need to follow these steps:
1. Have a working version of [React Native development environment](https://reactnative.dev/docs/environment-setup?guide=native)
2. Install dependencies
    ```bash
    npm install
    ```
3. Start the dev server
    ```bash
    npm start
    ```
Feel free to create issues or submit pull requests.

## 📄 [License MIT](LICENSE)


