export default interface CasterPoolEntry {
    url: string;
    // name: string; // get with the sourcetable and to be print on UI
    username: string;
    password: string
}
class CasterPool{
    subscribed: Array<CasterPoolEntry> // casters dont les bases sont affichées
    unsubscribed: Array<CasterPoolEntry> // casters enregistrés mais dont les bases sont pas affichées

    constructor(){
        // TODO : Récupérer du cache
        // sinon
        this.subscribed = new Array<CasterPoolEntry>()
        this.unsubscribed = new Array<CasterPoolEntry>()
    }

    static findCaster(url: string, list: Array<CasterPoolEntry>): number{
        for (const [index, value] of list.entries()){
            if (value.url === url){
                return index;
            }
        }
        return -1;
    }

    addCaster(url: string, username: string, password: string){
        if(CasterPool.findCaster(url, this.subscribed) === -1 && CasterPool.findCaster(url, this.unsubscribed) === -1){
            this.subscribed.push({
                url,
                username,
                password,
            })
            return;
        }
        throw new Error("Caster déja dans la liste.")
    }
    removeCaster(url: string){
        let index = CasterPool.findCaster(url, this.subscribed)
        if(index !== -1){
            this.subscribed.splice(index);
        }
        index = CasterPool.findCaster(url, this.unsubscribed)
        if(index !== -1) {
            this.unsubscribed.splice(index, 1);
        }
    }

    subscribe(url: string){
        let index = CasterPool.findCaster(url, this.unsubscribed)
        if(index !== -1){
            let el = this.unsubscribed.splice(index)[0];
            this.subscribed.push(el);
        }
        throw new Error("Caster pas unsubscribed")
    }
    unsubscribe(url: string){
        let index = CasterPool.findCaster(url, this.subscribed)
        if(index !== -1){
            let el = this.subscribed.splice(index)[0];
            this.unsubscribed.push(el);
        }
        throw new Error("Caster pas subscribed")
    }

}
