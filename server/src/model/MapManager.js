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
                longitude: 3.087776,
                image: "res/recompenses/1.jpg"
            }, {
                name: 'Bilda',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 2',
                latitude: 36.4701645,
                longitude: 2.8287985,
                image: "res/recompenses/2.jpg"

            },{
                name: 'Tamesguida',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 3',
                latitude: 36.4701645,
                longitude: 2.8287985,
                image: "res/recompenses/3.jpg"

            },{
                name: 'Médéa',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 4',
                latitude: 36.260344,
                longitude: 2.766957,
                image: "res/recompenses/4.jpg"
            },{
                name: 'Médéa',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 5',
                latitude: 36.262344,
                longitude: 2.766957,
                image: "res/recompenses/5.jpg"
            },{
                name: 'Médéa',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 6',
                latitude: 36.265344,
                longitude: 2.766957,
                image: "res/recompenses/6.jpg"
            },{
                name: 'In Salah',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 7',
                latitude: 27.1950331,
                longitude: 2.4826132,
                image: "res/recompenses/7.jpg"
            },{
                name: 'Tessalit',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 8',
                latitude: 20.231916,
                longitude: 0.863977,
                image: "res/recompenses/8.jpg"
            },{
                name: 'Gao',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 9',
                latitude: 16.2788129,
                longitude: -0.0412392,
                image: "res/recompenses/9.jpg"
            },{
                name: 'Tombouctou',
                fillKey: 'black',
                radius: 20,
                significance: 'Step 10',
                latitude: 16.7719091,
                longitude: -3.0087272,
                image: "res/recompenses/10.jpg"
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
        this.recompenses = [];
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
                // if(i<tmp.length-1 && i>0){
                //     tmp[i].latitude= (tmp[i-1].latitude+tmp[i].latitude)/2;
                //     tmp[i].longitude= (tmp[i-1].longitude+tmp[i].longitude)/2;
                // }
                // this.recompenses.push(tmp[i].image);
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

    drawArc(currentStep){
        this.arcs = [];
        for(let i=0; i<currentStep;i++){
            if(i < currentStep){
                this.arcs.push({
                    origin: {latitude: this.cities[i].latitude, longitude: this.cities[i].longitude},
                    destination: {latitude: this.cities[i+1].latitude, longitude: this.cities[i+1].longitude}
                });
            }
        }

    }

    // drawArc(m, currentStep){
    //     if (m === '8B') {
    //         this.arcs = [];
    //     } else if (m === 2) {
    //         this.arcs = [];
    //         for(let i=0; i<currentStep;i++){
    //             if(i < currentStep-1){
    //                 this.arcs.push({
    //                     origin: {latitude: this.cities[i].latitude, longitude: this.cities[i].longitude},
    //                     destination: {latitude: this.cities[i+1].latitude, longitude: this.cities[i+1].longitude}
    //                 });
    //             }
    //         }
    //     } else if (m === 3) {
    //
    //     }
    //     console.log(m);
    //     console.log(this.arcs);
    // }

    getTrophies(n, socket){
        socket.emit('new-trophy', {img: this.cities[n].image, step: n});


    }


};