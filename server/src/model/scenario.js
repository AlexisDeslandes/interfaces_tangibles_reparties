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
        text: "Le jour du départ approche. A la sortie du Carrefour d'Alger, tous vos sacs sont" +
            " pleins à craquer. Il ne reste que peu de place dans votre sacoche pour un seul objet." +
            "Que choisissez-vous d'emporter : ",
        jeanDidIt: "Jean Naud a choisi une couverture de survie.",
        choices: [
            {
                text: "Un parasol",
                result: "Vous tentez d'emporter un parasol. Malheureusement, vous ne parvenez pas à le faire rentrer" +
                    "dans votre sacoche...",
                stats: [
                    {type: 'mood', value: -1},
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
                text: "L'aventure commence enfin. Vous montez sur le vélo à 3 roues que vous vous êtes construit et vous" +
                    " lancez à travers l'Algérie."
            },
            {
                title: "Première escale",
                text: "Vous arrivez à Blida, votre ville natale. La ville vous semble gigantesque, bien plus grande qu'auparavent."
                    + " Des  centaines de logements écrasent aujourd'hui les champs de cultures que vous connaissiez si bien.",
            },

        ],
        type: "dilemme",
        time: "Janvier 1986 - Blida",
        text: "À l'approche d'une villa qui vous semble familière, vous remarquez un jeune Algérien " +
            " d'une dizaine d'années qui vous fixe du regard. Que choisissez-vous de faire ?",
        jeanDidIt: "Jean Naud est allé visiter sa maison d'enfance.",
        choices: [
            {
                text: "Dire bonjour",
                result: "Ce petit garçon habite aujourd'hui dans la villa. Vous réalisez qu'il s'agit en fait de votre ancienne demeure." +
                    "Cependant, rien n'est plus pareil, vous souvenirs semblent si lointains et flous. " +
                    "Vous êtes invité par la mère de l'enfant à visiter la maison et à partager un repas, ce qui vous " +
                    "envahit de nostalgie... Il est maintenant temps pour vous de reprendre la route.",
                stats: [
                    {type: 'mood', value: -2},
                    {type: 'chicken', value: 1}
                ]
            },
            {
                text: "Aller se promener au marché",
                result: "Rien de plus ressourçant qu'une promenade dans les rues de Blida. Vous vous promenez vous " +
                    "avez pu le faire tant de fois jadis dans ce magnifique marché. Vous reconnaissez un des vendeurs, ou" +
                    "plus exactement son étale, qui n'a pas bougé d'un centimètre. Vous décidez d'utiliser le peu de monnaie " +
                    "dont vous disposez pour lui acheter une tasse de son délicieux thé que appréciez tellement autrefois. " +
                    "Il est maintenant temps pour vous de reprendre la route.",
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
                title: "Le plus dur est à venir",
                text: "Vous arrivez sans trop de difficultés dans le petit village de Tamesguida. Au loin apparaissent les cols" +
                    " de Médéa : 11 kilomètres de montée sur la route nationale. La prochaine étape s'annonce déjà comme l'une " +
                    "des plus difficiles que vous allez devoir surmonter au cours de votre aventure."
            }
        ],
        type: 'dilemme',
        time: 'Janvier 1986 - Tamesguida',
        jeanDidIt: "Jean Naud a pris la route en terre.",
        text: 'A peine avez-vous quitté la ville que la route se sépare en deux. A gauche, une route en terre. ' +
            'A droite, un chemin caillouteux qui semble avoir été emprunté plus d\'une fois. Le choix n\'est pas évident, ' +
            'quelle route décidez-vous de suivre ?',
        choices: [
            {
                text: "La route en terre",
                result: "A première vue, cette route semble être le choix de la simplicité. Vous vous engagez sur cette route " +
                    "pendant une bonne heure. " +
                    "Horreur ! Vous vous apercevez que la terre a été fraîchement labourée par ... des sangliers. Sans " +
                    "compter les bruits de chacals dans les buissons, cette route est à présent un désastre. " +
                    "Heureusement, vous avez trouvé un petit coin sympa pour vous reposer, et vous êtes bien trop fatigué " +
                    "pour penser aux menaces éventuelles.",
                stats: [
                    {type: 'mood', value: -2},
                    {type: 'energy', value: 1}
                ]
            },
            {
                text: "Le chemin caillouteux",
                result: "Vous vous engagez sur le chemin caillouteux. Votre vélo tremble et vous peinez à le diriger. " +
                    "Difficile d'avancer dans ces conditions... Mais au loin, vous apercevez une oasis, ce qui vous donne " +
                    "un élan de motivation incroyable. Quoi de mieux pour reprendre des forces ?",
                stats: [
                    {type: 'mood', value: 2},
                    {type: 'energy', value: 2},
                    {type: 'water', value: 5},
                    {type: 'chicken', value: 5},
                    {type: 'bike', value: -3}
                ]
            }],
    },
    {
        intro: [
            {
                title: 'Le col de Médéa',
                text: 'Vous vous estimez vous être assez reposé. Il est temps pour vous d\'affronter cette terrible montée ' +
                    'qui vous fait si peur. 1100m de col à franchir, avec 180kg de packetage sur le vélo. La route est ' +
                    'raide et dangereuse. Les nombreuses voitures et les camions rendent l\'air irrespirable.'
            }
        ],
        time: 'Janvier 1986 - Médéa',
        type: 'dilemme',
        jeanDidIt: "Jean Naud a attendu que les camions passent.",
        text: "Vous être parvenu à gravir une bonne moitié de la côte, mais les camions ne cessent de défiler sur la " +
            "route, tout en vous enfumant de plus en plus. Il serait peut-être raisonnable d'attendre que le traffic " +
            "se calme un peu...",
        choices: [
            {
                text: "Attendre que les camions passent",
                result: "Vous décidez de respirer un peu d'air pur sur le côté, tout en faisant une petite pause. Trente " +
                    "minutes plus tard, vous vous remettez en route. Cependant, cette pause vous a tellement coupé dans votre " +
                    "élan que vous peinez à redémarrer, vous allez devoir redoubler de motivation pour venir à bout de cette côte.",
                stats: [
                    {type: 'mood', value: 1},
                    {type: 'energy', value: -3}
                ]
            },
            {
                text: "Ne pas perdre de temps",
                result: "Vous décidez de ne pas vous couper dans votre élan. Quel enfer ! Avec le bruit et la pollution, " +
                    "vous peinez à gravir la montée... Vous êtes cependant persuadé que vous avez fait le bon choix, car vous " +
                    "auriez eu beaucoup de mal à reprendre la montée après une pause...",
                stats: [
                    {type: 'mood', value: -2},
                    {type: 'energy', value: -2}
                ]
            }
        ]
    },
    {
        intro: [{
            title: "Arrivée à Médéa",
            text: "Vous arrivez enfin à bout de cette montée infernale, juste avant la tombée de la nuit. En plus, comme pour " +
                "couronner votre succès, le Muezzin est en train de chanter l'appel à la prière du haut du Minaret."
        }],
        time: "Janvier 1986 - Médéa",
        type: "dilemme",
        jeanDidIt: "Jean Naud a choisi de regarder le coucher de soleil.",
        text: "Demain, vous partez pour In Salah, c'est une gigantesque traversée qui vous attend... Vous établissez votre " +
            "campement pour la nuit.",
        choices: [
            {
                text: "Regarder le coucher de soleil",
                result: "Vous observez ce magnifique coucher de soleil qui domine la ville de Médéa et pensez à la journée de " +
                    "demain. Ces moments sont ceux pour lesquels vous vous êtes lancés dans une telle aventure.",
                stats: [
                    {type: "mood", value: 3},
                    {type: "energy", value: 2}
                ]
            },
            {
                text: "Aller vous coucher immédiatement",
                result: "Vous ne perdez pas de temps et allez vous reposer immédiatement afin d'être en pleine forme demain.",
                stats: [
                    {type: "energy", value: 3}
                ]
            }
        ]
    },
    {
        intro: [{
            title: "Départ pour In-Salah",
            text: "A votre réveil, vous êtes débordant d'énergie. Prochaine étape: In-Salah! Une grande traversée sablée vous attend."
        }],
        time: "Janvier 1986 - Médéa",
        type: "dilemme",
        jeanDidIt: "Jean Naud a dégonflé les pneus de son vélo.",
        text: "Vous rangez toutes vos affaire et vous préparez à partir. Vous prenez juste le temps de faire une petite modification " +
            "sur votre vélo avant de quitter Médéa.",
        choices: [
            {
                text: "Dégonfler vos pneus",
                result: "Comme vous vous apprêtez rouler principalement sur du sable, vous jugez plus sage de dégonfler " +
                    "un peu vos pneus. C'est très efficace, et vous parvenez à évoluer dans le desert sans trop de peine.",
                stats: [
                    {type: "mood", value: 1}
                ]
            },
            {
                text: "Rembourrer votre selle",
                result: "Vous rembourrez votre selle avec ce qui vous passe par la main et vous engagez dans le desert. Vous " +
                    "appreciez votre nouveau confort fessier, mais vous peinez à pédaler dans le sable, peut-être auriez-vous " +
                    "dû dégonfler un peu vos pneus. Vous avez déjà bien abimé votre vélo mais décidez de dégonfler vos pneus " +
                    "pour la suite du trajet.",
                stats: [
                    {type: "energy", value: -1},
                    {type: "bike", value: -3},
                    {type: "mood", value: 1}
                ]
            },
            {
                text: "Regonfler vos pneus",
                result: "Vous décidez de remettre un peu de pression dans vos pneus. Après un bon bout de trajet difficile, " +
                    "vous vous demandez si vous n'auriez pas plutôt dû les dégonfler pour rouler sur du sable. Vous avez déjà bien abimé votre vélo mais décidez de dégonfler vos pneus " +
                    "pour la suite du trajet.",
                stats: [
                    {type: "energy", value: -3},
                    {type: "bike", value: -3}
                ]
            }
        ]
    },
    {
        intro: [{
            title: "En route pour In-Salah",
            text: "Cela fait maintenant plusieurs jours que vous roulez dans le désert entre Médéa et In-Salah. Vous avez " +
                "un peu perdu la notion des jours, mais vous essayez au mieux de garder une trace des jours et des heures " +
                "qui passent."
        }],
        time: "Février 1986 - In-Salah",
        type: "dilemme",
        text: "Les paysages que vous traversez sont magnifiques et incroyables. Etant petit, vous avez effectué ce trajet plus " +
            "d'une fois en voiture avec vos parents. Cette fois vous êtes seul, et en vélo, le trajet prend une toute autre " +
            "tournure. Vous quittez un instant vos pensées pour vous reconcentrer. Oui, c'est bien un oasis que vous apercevez " +
            "au loin. C'est parfait pour vous requinquer!",
        choices: [
            {
                text: "Faire une sieste",
                result: "Vous vous sentez si bien dans cet oasis, vous vous reposez afin de mieux repartir. Pour couronner le tout, " +
                    "In-Salah n'est plus si loin et vous serez arrivés d'ici la tombée de la nuit!",
                stats: [
                    {type: "energy", value: 10},
                    {type: "mood", value: 10}
                ]
            },
            {
                text: "Manger des dates",
                result: "Vous avez si faim, la simple vue de ces palmiers datiers vous fait saliver d'avance. Vous vous faites " +
                    "un festin de ces dates qui n'attendaient que vous. Pour couronner le tout," +
                    "In-Salah n'est plus si loin et vous serez arrivés d'ici la tombée de la nuit!",
                stats: [
                    {type: "chicken", value: 10},
                    {type: "mood", value: 10},
                ]
            },
            {
                text: "Boire de l'eau",
                result: "Cet oasis tombe vraiment à pic, vous étiez assoiffé! Vous vous précipitez près de l'eau et buvez " +
                    "autant que possible. Pour couronner le tout, In-Salah n'est plus si loin et vous serez arrivés d'ici " +
                    "la tombée de la nuit!",
                stats: [
                    {type: "water", value: 10},
                    {type: "mood", value: 10}
                ]
            }
        ]
    },
    {
        intro: [{
            title: "En route pour Tessalit",
            text: "Vous avez bien pris le temps de vous reposer à In-Salah. Il est maintenant temps pour vous de reprendre " +
                "votre aventure! Vous êtes plus motivés que jamais, en effet vous avez déjà effectué plus de la moitié du trajet!"
        }],
        time: "Mars 1986 - Tessalit",
        type: "dilemme",
        jeanDidIt: "Jean Naud a dit « Vous avez des problèmes je crois !» aux touristes anglais.",
        text: "A votre arrivée à Tessalit, vous voyez une Peugeot 404 embourbée dans le sable. Ce sont deux touristes " +
            "anglais qui sont en difficulté. Vous décidez de les aider, vous dites:",
        choices: [
            {
                text: "Vous avez des problèmes je crois",
                result: "Vous parvenez à calmer les touristes et vous les aidez à se sortir de leurs ennuis. Ils vous " +
                    "remercient chaleureusement, et vous partez chacun de votre côté. Cette interaction humaine vous " +
                    "redonne le sourire. Vous partez maintenant pour Gao mais voila que vous êtes pris dans une tempête " +
                    "de sable !",
                stats: [
                    {type: "mood", value: 1}
                ]
            },
            {
                text: "Vous venez souvent par ici ?",
                result: "Vous parvenez à calmer les touristes et vous les aidez à se sortir de leurs ennuis. Ils vous " +
                    "remercient chaleureusement, et vous partez chacun de votre côté. Cette interaction humaine vous " +
                    "redonne le sourire. Vous partez maintenant pour Gao mais voila que vous êtes pris dans une tempête " +
                    "de sable !",
                stats: [
                    {type: "mood", value: 1}
                ]
            }
        ]
    },
    {
        type: "minijeu"
    },
    {
        intro: [{
            title: "En route vers Gao",
            text: "Vous vous trouvez entre Tessalit et Gao, et vous vous lancez dans l'ascenssion d'une pente assez raide."
        }],
        time: "Mars 1986 - Gao",
        type: "dilemme",
        text: "Vous savez que vous y êtes presque, mais vous commencez à fatiguer séverement. Vous réflechissez aux deux " +
            "possibilités qui s'offrent à vous.",
        choices: [
            {
                text: "Faire demi-tour et contourner",
                result: "Vous décidez de contourner cette pente qui vous effraie quelque peu. Pas de chance, le chemin " +
                    "qui permet de contourner et bien plus long qu'il n'en avait l'air... De plus la nuit est maintenant " +
                    "en train de tomber.",
                stats: [
                    {type: "energy", value: -2},
                    {type: "mood", value: -3},
                ]
            },
            {
                text: "Continuer de monter",
                result: "Vous prenez sur vous et continuez à grimper. C'est épuisant mais vous ne lâchez rien, vous êtes " +
                    "si proche du but!",
                stats: [
                    {type: "bike", value: -1},
                    {type: "mood", value: 1}
                ]
            },
        ]
    },
    {
        intro: [{
            title: "Gao",
            text: "Vous êtes arrivés à Gao! Bonne nouvelle, c'est la dernière étape avant votre objectif: Tombouctou. Vous " +
                "vous baladez un peu dans la ville, même si vous êtes à bout de force."
        }],
        time: "Avril 1986 - Gao",
        type: "dilemme",
        text: "Vous paraissez vraiment affaibli, et alors que vous vous apprêtiez à reprendre la route pour terminer votre " +
            "aventure, vous tombez sur les touristes que vous aviez aidé à Tessalit. Ils vous disent: \"Vous avez des " +
            "problèmes j'ai l'mpression!\". Vous riez, et vous êtes content de les revoir. Vous leur parlez alors de " +
            "votre aventure, ils sont complètement épatés.",
        choices: [
            {
                text: "Partir pour Tombouctou",
                result: "Vous êtes si proche de la fin que vos membres en tremblent. Vous vous" +
                    "enfoncez dans le désert pendant plus de trois heures quand une tempête de sable se lève derrière vous." +
                    "Elle vient vers vous! Vous devez à tout prix accélérer pour l'éviter...",
                stats: [
                    {type: "mood", value: 10},
                ]
            },
            {
                text: "Abandonner",
                result: "Vous restez à Gao, et renoncez à votre exploit. C'est dommage.",
                stats: [
                    {type: "mood", value: -10},
                    {type: "energy", value: -10}
                ]
            },
        ]
    }
];
