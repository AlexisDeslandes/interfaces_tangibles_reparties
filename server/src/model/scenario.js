module.exports = [
    {
        intro: [
            {
                title: "Bienvenue au cœur de l'aventure de Jean Naud",
                text: "En 1986, Jean Naud s'engage dans la traversée du Sahara à vélo. D'Alger" +
                    " à Tombouctou, découvrez une partie des 3200 km de cette folle expédition."
            },
            {
                text: "Au cours de l'aventure, vous serez exposés aux mêmes choix qui se sont présentés à Jean Naud." +
                    "Chacun de vos choix impactera vos jauges : la soif, la faim, l'énergie, l'état du vélo et la santé " +
                    "mentale."
            }
        ],
        type: "dilemme",
        time: "Janvier 1986 - Alger",
        text: "Le jour du départ approche. A la fin des courses au supermarché, tous les sacs sont" +
            " pleins à craquer. Il ne reste qu'un peu de place dans une sacoche pour un seul objet." +
            "Que choisissez-vous d'emporter : ",
        choices: [
            {
                text: "Un parapluie",
                result: "On ne sait jamais...",
                stats: [
                    {type: 'Parapluie', value: 1},
                ]
            },
            {
                text: "Une couverture de survie",
                result: "Un choix tactique...",
                stats: [
                    {type: 'Couverture', value: 1}]
            },
            {
                text: "Une calculette",
                result: "Pourquoi pas.",
                stats: [
                    {type: 'Calculette', value: 1}]
            },
        ],
    },
    {
        intro: [
            {
                title: "C'est parti !",
                text: "L'aventure commence enfin. Bien calé sur son vélo à 3 roues, Jean Naud" +
                    " se lance à travers l'Algérie."
            },
            {
                title: "Première escale",
                text: "Nous arrivons à Blida, la ville natale de Jean. La ville lui semble gigantesque."
                    + " Des  centaines de logements écrasent aujourd'hui les champs de cultures qu'il connaissait.",
            },

        ],
        type: "dilemme",
        time: "Janvier 1986 - Blida",
        text: "À l'approche d'une villa qui lui semble familiaire, Jean Naud remarque un jeune Algérien " +
            " d'une dizaine d'années qui le fixe du regard. Que choisissez-vous de faire ?",
        choices: [
            {
                text: "Dire bonjour",
                result: "Ce petit garçon habite aujourd'hui dans la maison d'enfance de Jean. Rien " +
                    "n'est plus pareil, les souvenirs semblent si lointains. Jean est invité par la mère de l'enfant "
                    + "à visiter la maison et à partager un repas. Il se laisse envahir par la nostalgie..." +
                    "par la nostalgie.",
                stats: [
                    {type: 'mood', value: -1},
                    {type: 'chicken', value: 1}
                ]
            },
            {
                text: "Aller se promener au marché",
                result: "Rien de plus ressourçant qu'une promenade dans les rues de Blida.",
                stats: [
                    {type: 'mood', value: 1},
                    {type: 'water', value: 1}
                ]
            },
        ]
    },/*
    {
        intro : [],
        type:'',
        time:'',
        text:'',
        choices:[],

    }*/
];
