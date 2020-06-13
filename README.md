# HueLabs Platform - Beta

A platform that exposes HueLabs formulas as switches in Homekit.

A restart of Homebridge is required to reflect changes in Huelabs configuration.

## Installation instructions

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

 `sudo npm install -g homebridge-huelabs`

## Example config.json:

```json
{
  "bridge": {
      ...
  },
  "platforms": [
    {
      "platform": "HueLabs",
      "host": "<hue gateway IP Address>",
      "port": "80",
      "user": "<hue authorized user token>",
      "quiet": true
    }
  ]
}
```

`host`: IP Address or hostname of the Hue Gateway

`port`: Port to use for the Hue Gateway

`user`: Your Hue Authorized User Token.  See this guide to get setup:  [How to Develop for Hue](https://developers.meethue.com/develop/get-started-2/) 

### Optional platform settings:

`quiet`: If set to `true`, logging will only happen for errors.  If not present or set to "false", log will contain entries for each sensor reading. (default: `false`)

## Credits

See [CONTRIBUTORS](CONTRIBUTORS.md) for acknowledgements to the individuals that contributed to this plugin.

## Some asks for friendly gestures

If you use this and like it - please leave a note by staring this package here or on GitHub.

If you use it and have a problem, file an issue at [GitHub](https://github.com/rnilsson/homebridge-huelabs/issues) - I'll try to help.

If you tried this, but don't like it: tell me about it in an issue too. I'll try my best
to address these in my spare time.

If you fork this, go ahead - I'll accept pull requests for enhancements.

## License

MIT License

Copyright (c) 2020 Robert Nilsson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.