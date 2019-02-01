module.exports = [
    {
        intro: [
            {
                title: "Bienvenue au cœur de l'aventure de Jean Naud",
                text: "En 1986, Jean Naud s'engage dans la traversée du Sahara à vélo. D'Alger" +
                " à Tombouctou, découvrez une partie de cette folle expédition de 3200 km."
            },
            {
                text: "Au cours de l'aventure, vous serez exposés aux mêmes choix qui se sont présentés à Jean Naud." +
                    "Chacun de vos choix impactera votre aventure. Votre soif, votre faim, votre énergie, l'état de " +
                "votre vélo ainsi que votre santé mentale seront des indicateurs auxquels vous devrez faire attention" +
                "tout au long de l'aventure."
            }
        ],
        type: "dilemme",
        time: "Janvier 1986 - Alger",
        text: "Le jour du départ approche. A la fin sortie du Carrefour d'Alger, tous vos sacs sont" +
            " pleins à craquer. Il ne reste que peu de place dans votre sacoche pour un seul objet." +
            "Que choisissez-vous d'emporter : ",
        choices: [
            {
                text: "Un parasol",
                result: "",
                stats: [
                    {type: 'Parasol', value: 1},
                ]
            },
            {
                text: "Une couverture de survie",
                result: "Vous pliez la couverture au maximum pour qu'elle rentre dans votre sacoche et prenez la route.",
                stats: [
                    {type: 'Couverture', value: 1}]
            },
            {
                text: "Un sac de couchage bien douillet",
                result: "Vous pliez le sac de couchage au maximum pour qu'il rentre dans votre sacoche et prenez la route.",
                stats: [
                    {type: 'Duvet', value: 1}]
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
    },
    {
        intro: [
            {
                title: "La montée de l'enfer",
                text: "Nous arrivons à Tamesguida. Au loin apparaissent les cols" +
                " de Médéa : 11 km de montée sur la route nationale. La prochaine étape s'annonce corsée..."
            }
        ],
        type: 'dilemme',
        time: 'Janvier 1986 - Tamesguida',
        text: 'A peine avez-vous quitté la ville que la route se sépare en deux. A gauche, une route en terre. ' +
        'A droite, un chemin caillouteux. Quel' +
        ' route décidez-vous de suivre ?',
        choices: [
            {
                text: "La route en terre",
                result: "Horreur ! La terre a été fraîchement labourée par ... des sangliers. Sans " +
                "compter les bruits de chacals dans les buissons, cette route est un désastre. " +
                "Heureusement, vous avez trouvé un petit coin sympa pour faire une sieste.",
                stats: [
                    {type: 'mood', value: -1},
                    {type: 'energy', value: 1}
                ]
            },
            {
                text: "Le chemin caillouteux",
                result: "Le vélo tremble en roulant sur les cailloux. Difficile d'avancer dans ces " +
                "conditions... Mais au loin, vous apercevez une oasis. Quoi de mieux pour reprendre des forces ?",
                stats: [
                    {type: 'mood', value: 1},
                    {type: 'energy', value: 1},
                    {type: 'water', value: 1},
                    {type: 'chicken', value: 1}
                ]
            }],
    },
    {
        intro: [
            {
                title: 'Le col de Médéa',
                text: 'La terrible montée commence. 1100m de col à franchir, avec 180kg ' +
                'de packetage sur le vélo. La route est raide et dangereuse. Les voitures ' +
                "rendent l'air irrespirable."
            }
        ],
        time: 'Janvier 1986 - Médéa',
        type: 'dilemme',
        text: "Des camions ne cessent de défiler sur la route. Il est peut-être raisonnable d'attendre que le traffic se calme. Que décidez-vous de faire ?",
        choices: [
            {
                text: "Attendre que les camions passent",
                result: "Bonne idée, la route sera plus calme et le voyage plus agréable après une petite pause.",
                stats: [
                    {type: 'mood', value: 1},
                    {type: 'energy', value: -1}
                ]
            },
            {
                text: "Ne pas perdre de temps",
                result: "Quel enfer ! Avec le bruit et la pollution, vous peinez à gravir la montée...",
                stats: [
                    {type: 'mood', value: -1},
                    {type: 'energy', value: -2}
                ]
            }
        ]
    },
    {
        type : "minijeu"
    }
    /*
    {
        intro: [{
            title:"Le voyage continue",
            text:"Une grande traversée nous attend aujourd'hui ! "
        }],
        time:"",
        type:"",
        text:"",
        choices: [
            {
                title:"",
                text: "",
                stats : {
                    type : "",
                    value : 0
                }
            }
        ]
    }

    /*
    ,
    {
        intro: [{
            title:"",
            text:""
        }],
        time:"",
        type:"",
        text:"",
        choices: [
            {
                title:"",
                text: "",
                stats : {
                    type : "",
                    value : 0
                }
            }
        ]
    }
    */
];
