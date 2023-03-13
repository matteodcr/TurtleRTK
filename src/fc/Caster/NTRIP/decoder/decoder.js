const {EventEmitter} = require('events');
const config = require('./config');
const {checkRtcmCrc24} = require('./crc24');
global.Buffer = global.Buffer || require('buffer').Buffer;

class NtripDecoder extends EventEmitter {
  /**
   * create new instance of NtripDecoder
   */
  constructor() {
    super();

    /**
     * @member {Buffer} - data buffer
     */
    this.buffer = Buffer.alloc(0);
    /**
     * @member {Boolean} - check data header is decoded
     */
    this.isHeader = false;
    /**
     * @member {String} - the type of decode data
     */
    this.dataType = '';
  }

  /**
   * decode data
   * @param {Buffer} data data to be decoded
   */
  decode(data) {
    if (!Buffer.isBuffer(data)) {
      return;
    }
    this._concat(data);
    this._decodeData();
  }

  /**
   * close the decoder
   */
  close() {
    this._clear();
  }

  /**
   * concat buffer
   * @param {Buffer} data data to be decoded
   */
  _concat(data) {
    this.buffer = Buffer.concat([this.buffer, data]);
  }

  /**
   * emit data event
   * @param {Buffer} data decoded data
   */
  _onData(data) {
    this.emit('data', data);
  }

  /**
   * emit error event
   * @param {(string|error)} err error information
   */
  _onError(err) {
    this._clear();
    this.emit('error', err);
  }

  /**
   * clear buffer data
   */
  _clear() {
    this.buffer = Buffer.alloc(0);
  }

  /**
   * decode data
   */
  _decodeData() {
    // check is header decoded
    if (!this.isHeader) {
      this._decodeHeader();
      return;
    }

    this._decodeBody();
  }

  /**
   * decode header data
   */
  _decodeHeader() {
    let separatorBuf = config.HEADER_SEPARATOR_BUFF;
    // find the index of \r\n\r\n
    let idx = this.buffer.indexOf(separatorBuf);
    if (idx < 0) {
      // rtk2go server response "ICY 200 OK\r\n"
      separatorBuf = config.LINE_SEPARATOR_BUFF;
      idx = this.buffer.indexOf(separatorBuf);
      if (idx < 0) {
        if (this.buffer.length >= config.MAX_HEADER_LENGTH) {
          this._onError(config.MAX_HEADER_ERROR);
        }
        return;
      }
    }

    // slice header data
    const headerBuf = this.buffer.slice(0, idx);
    const headerStr = headerBuf.toString();

    // header data start with GET
    if (headerStr.startsWith(config.ROVER_PREFIX)) {
      this.dataType = config.ROVER_DATA;
    }

    // header data start with (SOURCE|ICY|HTTP/1.1 200 OK)
    if (
      headerStr.startsWith(config.SOURCE_PREFIX) ||
      headerStr.startsWith(config.RELAY_PREFIX) ||
      headerStr.startsWith(config.JPL_PREFIX)
    ) {
      this.dataType = config.SOURCE_DATA;
    }
    if (
      headerStr.startsWith(config.RESOURCETABLE_PREFIX) ||
      headerStr.includes('STR')
    ) {
      this.dataType = config.SOURCETABLE_DATA;
    }

    if (this.dataType === '') {
      this._onError(`${config.UNKOWN_HEADER_ERROR}${headerStr}`);
      return;
    }

    // set buffer data
    this.buffer = this.buffer.slice(idx + separatorBuf.length);
    this.isHeader = true;
    this._onData(headerBuf);

    this._decodeData();
  }

  /**
   * decode body data
   */
  _decodeBody() {
    if (this.dataType === config.ROVER_DATA) {
      this._decodeRoverData();
    } else if (this.dataType === config.SOURCE_DATA) {
      this._decodeSourceData();
    } else if (this.dataType === config.SOURCETABLE_DATA) {
      this._decodeSourcetableData();
    }
  }

  /**
   * decode rover data
   */
  _decodeRoverData() {
    // find the index of \r\n
    const idx = this.buffer.indexOf(config.ROVER_SUFFIX_BUFF);
    if (idx < 0) {
      if (this.buffer.length >= config.MAX_ROVER_LENGTH) {
        this._onError(config.MAX_ROVER_ERROR);
      }
      return;
    }

    // slice rover data from $ to \r\n, include $
    const roverData = this.buffer.slice(0, idx);
    // renew buffer data
    this.buffer = this.buffer.slice(idx + config.ROVER_SUFFIX_BUFF.length);
    this._onData(roverData);

    this._decodeData();
  }

  /**
   * decode source data
   */
  _decodeSourceData() {
    // find the index of 0xd3
    const idx = this.buffer.indexOf(config.PREAMB);
    if (idx < 0) {
      // reset the buffer data
      this.buffer = Buffer.alloc(0);
      return;
    }

    // slice valid data
    this.buffer = this.buffer.slice(idx);

    // rtcm data must be greater than 3 bytes
    if (this.buffer.length < config.RTCM_MIN_LENGTH) {
      return;
    }

    /*
     * rtcm3 message format:
     *   +----------+--------+-----------+--------------------+----------+
     *   | preamble | 000000 |  length   |    data message    |  parity  |
     *   +----------+--------+-----------+--------------------+----------+
     *   |<-- 8 --->|<- 6 -->|<-- 10 --->|<--- length x 8 --->|<-- 24 -->|
     */
    const rtcmLenBuf = Buffer.from([this.buffer[1], this.buffer[2]]);
    const rtcmLen = rtcmLenBuf.readUInt16BE(0) & 0x03ff;
    const rtcmFullLen = rtcmLen + config.RTCM_ADD_LENGTH;
    if (this.buffer.length < rtcmFullLen) {
      return;
    }

    const rtcmData = this.buffer.slice(0, rtcmFullLen);
    // check rtcm crc24
    if (!checkRtcmCrc24(rtcmData)) {
      // remove the first byte and rehandle data
      this.buffer = this.buffer.slice(1);
      this._decodeData();
      return;
    }

    // slice the rest data
    this.buffer = this.buffer.slice(rtcmFullLen);
    this._onData(rtcmData);

    this._decodeData();
  }

  _decodeSourcetableData() {
    // find the index of \r\n
    const idx = this.buffer.indexOf(config.LINE_SEPARATOR_BUFF);
    if (idx < 0) {
      return;
    }

    // slice rover data from $ to \r\n, include $
    const sourcetableData = this.buffer.slice(0, idx);
    // renew buffer data
    this.buffer = this.buffer.slice(idx + config.LINE_SEPARATOR_BUFF.length);
    this._onData(sourcetableData);

    this._decodeData();
  }
}

module.exports = {
  NtripDecoder,
};
