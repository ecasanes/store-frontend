export class Role {

    constructor() {

        this.name = "";
        this.code = "";
        this.rank = null;
        this.hasPermissions = null;
    }

    id?: number;
    name: string;
    code: string;
    rank: number;
    hasPermissions: number;
}