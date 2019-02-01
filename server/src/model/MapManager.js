module.exports = class MapManager {

    /**
     *
     */
    constructor() {
        this.cities = [
            {
                name: 'Alger',
                fillKey: 'black',
                radius: 20,
                significance: 'Step 1',
                latitude: 36.731088,
                longitude: 3.087776
            },{
                name: 'Bilda',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 2',
                latitude: 36.4701645,
                longitude: 2.8287985
            },{
                name: 'Médéa',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 3',
                latitude: 36.265344,
                longitude: 2.766957
            },{
                name: 'In Salah',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 4',
                latitude: 27.1950331,
                longitude: 2.4826132
            },{
                name: 'Tessalit',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 5',
                latitude: 20.231916,
                longitude: 0.863977
            },{
                name: 'Gao',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 6',
                latitude: 16.2788129,
                longitude: -0.0412392
            },{
                name: 'Tombouctou',
                fillKey: 'black',
                radius: 20,
                significance: 'Step 7',
                latitude: 16.7719091,
                longitude: -3.0087272
            },
        ];
        this.arcs =[];
        this.progression = [];
        for(let i=0;i<this.cities.length; i++){
            if(i!==0 || i!==this.cities.length-1) {
                this.cities[i].fillKey = 'grey'
                // this.cities[i].fillKey: 'grey';
            }
            this.progression.push(this.cities[i]);
        }
    }

    refreshStep(n){
        // this.progression = [];
        console.log(n);
        let tmp = this.progression;
        for(let i=0;i<tmp.length; i++){
           if( i!==n){
                tmp[i].fillKey = 'grey';
                tmp[i].radius = 5;
                // this.cities[i].fillKey: 'grey';
            }
            else{
                tmp[i].fillKey = 'blue';
                tmp[i].radius = 15;
            }
            // this.progression.push(this.cities[i]);
        }
        this.progression = tmp;

    }

    sendProgression(socket) {
        socket.emit('map-progressed', this.progression);
    }
    sendArcs(socket) {
        socket.emit('map-changed', this.arcs);
    }

    drawArc(m){
        if (m === 1) {
            this.arcs = [];
        } else if (m === 2) {
            this.arcs = [];
            for(let i=0; i<this.cities.length;i++){
                if(i < this.cities.length-1){
                    this.arcs.push({
                        origin: {latitude: this.cities[i].latitude, longitude: this.cities[i].longitude},
                        destination: {latitude: this.cities[i+1].latitude, longitude: this.cities[i+1].longitude}
                    });
                }
            }
        } else if (m === 3) {

        }
        console.log(m);
        console.log(this.arcs);
    }




};