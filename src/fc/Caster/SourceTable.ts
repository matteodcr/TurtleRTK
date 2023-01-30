import Base from "./Base";
import {
    CasterTransportDefinition,
    NtripPushPullTransport,
    NtripVersion,
} from "@ntrip/caster";
import Network from "./Network";
import Caster from "./Caster";

export type SourceTableEntries = {
    baseList: Array<Base>;
    networkList: Array<Network>;
    casterList: Array<Caster>;
}
export default class SourceTable {
    get entries(): SourceTableEntries {
        return this._entries;
    }

    set entries(value: SourceTableEntries) {
        this._entries = value;
    }
    private _entries: SourceTableEntries;

    adress: string;

    constructor(adress: string) {
        this.adress = adress;
    }

    async getSourceTable(adress: string) {
        try {
            var rawSourceTable = await (await fetch(adress, {
                headers: {
                    'Ntrip-Version': 'Ntrip/2.0',
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0',
                }
            })).text()
        } catch (error) {
            console.error(error);
            throw new Error("Response error")
        }

        var entries: SourceTableEntries = {
            baseList: new Array<Base>(),
            casterList: new Array<Caster>(),
            networkList: new Array<Network>()
        }

        var lines = rawSourceTable.split("\r\n");
        var firstLine: number = -1;
        var lastLine: number = -1;
        for (var i = 0; i < lines.length; i++) {
            if (this.isSourceTableEntry(lines[i]) && firstLine == -1) {
                firstLine = i;
            } else if (lines[i] == "ENDSOURCETABLE"){
                lastLine = i;
                //TODO : save in cache
                break;
            }
            if (lastLine == -1 && firstLine != -1 && this.isCasterEntry(lines[i])){
                entries.casterList.push(new Caster(this, lines[i].split(";")))
            } else if (lastLine == -1  && firstLine != -1 && this.isNetworkEntry(lines[i])){
                entries.networkList.push(new Network(this, lines[i].split(";")))
            } else if (lastLine == -1  && firstLine != -1 && this.isStreamEntry(lines[i])){
                entries.baseList.push(new Base(this, lines[i].split(";")))
            } else {
                //TODO : handle unparsable lines
            }
        }
        return entries;
    }

    isCasterEntry(line: string): boolean {
        return line.substring(0, 3) == "CAS"
    }

    isNetworkEntry(line: string): boolean {
        return line.substring(0, 3) == "NET"
    }

    isStreamEntry(line: string): boolean {
        return line.substring(0, 3) == "STR"
    }

    isSourceTableEntry(line: string): boolean {
        return this.isCasterEntry(line) || this.isNetworkEntry(line) || this.isStreamEntry(line)
    }
}

async function main(adress: string) {
    let st: SourceTable = new SourceTable(adress);
    st.entries = await st.getSourceTable(adress);
    console.log(st.entries.baseList);
}

main("http://caster.centipede.fr:2101/")


