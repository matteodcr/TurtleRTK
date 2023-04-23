import {Buffer} from 'buffer';

// header data separator
const HEADER_SEPARATOR_BUFF = Buffer.from('\r\n\r\n');
// line separator
const LINE_SEPARATOR_BUFF = Buffer.from('\r\n');
// rover data separator
const ROVER_SUFFIX_BUFF = Buffer.from('\r\n');

// max lenght of header data
const MAX_HEADER_LENGTH = 1024;
// max length of rover data
const MAX_ROVER_LENGTH = 256;

// the prefix of rover data
const ROVER_PREFIX = 'GET';
// the prefix of source data
const SOURCE_PREFIX = 'SOURCE';
// the prefix of ntripcaster response
const RELAY_PREFIX = 'ICY';
// the prefix of jpl ntripcaster response
const JPL_PREFIX = 'HTTP/1.1 200 OK';
// the prefix of source table response
const RELAY_SOURCETABLE_PREFIX = 'SOURCETABLE 200 OK';

// define the sign for rover data
const ROVER_DATA = 'ROVER';
// define the sign for source data
const SOURCE_DATA = 'SOURCE';
// define the sign for sourcetable data
const SOURCETABLE_DATA = 'SOURCETABLE';

// max header data error
const MAX_HEADER_ERROR = 'The data length out of header limit';
// rover data error
const MAX_ROVER_ERROR = 'The data length out of rover limit';
// unkown header data error
const UNKOWN_HEADER_ERROR = 'Unkown header data:';

// rtcm data PREAMB
const PREAMB = Buffer.from([0xd3]);
// the min length of rtcm data
const RTCM_MIN_LENGTH = 3;
// the length for additional rtcm data
const RTCM_ADD_LENGTH = 6;

module.exports = {
  HEADER_SEPARATOR_BUFF,
  LINE_SEPARATOR_BUFF,
  ROVER_SUFFIX_BUFF,
  MAX_HEADER_LENGTH,
  MAX_ROVER_LENGTH,
  MAX_HEADER_ERROR,
  MAX_ROVER_ERROR,
  UNKOWN_HEADER_ERROR,
  ROVER_PREFIX,
  SOURCE_PREFIX,
  RELAY_PREFIX,
  JPL_PREFIX,
  RELAY_SOURCETABLE_PREFIX,
  ROVER_DATA,
  SOURCE_DATA,
  SOURCETABLE_DATA,
  PREAMB,
  RTCM_MIN_LENGTH,
  RTCM_ADD_LENGTH,
};
