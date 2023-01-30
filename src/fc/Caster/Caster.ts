import SourceTable from "./SourceTable";

export default class Caster {
    parentSourceTable: SourceTable;

    host: string; //  host name or IP address
    port: number; //  port number
    identifier: string; // SourceTable Identifier - Name of SourceTable or SourceTable provider
    operator: string; // Name of institution or company operating the caster
    nmea: boolean; // SourceTable accepts NMEA input (true) or not (false)
    country: string; //  ISO 3166 country code
    latitude: number // Position, Latitude in degree
    longitude: number // Position, Longitude in degree
    fallbackHost: string // Fallback SourceTable Internet address (0.0.0.0 = no fallback)
    fallbackIP: number // Fallback SourceTable Port number (0 = no fallback)
    misc: string

    constructor(sourceTable: SourceTable, line : string[]) {
        if (line.length == 12){
            this.parentSourceTable = sourceTable;
            this.host = line[1].trim();
            this.port = +line[2];
            this.identifier = line[3].trim();
            this.operator = line[4].trim();
            this.nmea = +line[5]==1;
            this.country = line[6].trim();
            this.latitude = +line[7];
            this.longitude = +line[8];
            this.fallbackHost = line[9].trim();
            this.fallbackIP = +line[10];
            this.misc = line[11];
        }
    }

}