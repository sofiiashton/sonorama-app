export const Colors = {
    background: "white",
    stroke: "rgba(0, 0, 0, 0.05)",
    buttonMainFill: "#EE8D1B",
    buttonMainStroke: "#FEB054",
    buttonMainText: "white",
    buttonSecondaryFill: "rgba(238, 141, 27, 0.1)",
    buttonSecondaryStroke: "#CB7510",
    buttonSecondaryText: "#CB7510",
    spotifyButtonFill: "#1CD760",
    spotifyButtonStroke: "#8FF2B3",
    cardBackround: "rgba(238, 141, 27, 0.05)",
    cardStroke: "rgba(118, 79, 33, 0.1)",
    blueCardBackground: "rgba(25, 45, 229, 0.05)",
    blueCardStroke: "rgba(0, 0, 0, 0.1)",
    placeholderBackground: "#F2F1F0",
    placeholderText: "rgba(0, 0, 0, 0.4)",
    optionSelectedFill: "#FADDBB",
    optionSelectedStroke: "#ECC79B",
    optionSelectedText: "#573D1F",
    optionDisabledFill: "#F2F1F0",
    optionDisabledStroke: "#E8E8E8",
    optionDisabledText: "rgba(0, 0, 0, 0.4)",
    textDefault: "#2C2202",
    textSecondary: "#rgba(0, 0, 0, 0.4)",
    textGreeting: "rgba(0, 0, 0, 0.2)",
    textTooltip: "#573D1F",
    iconTooltip: "#rgba(87, 61, 31, 0.4)",
   }
   
   export const Spacing = {
    screenPadding: 24,
    iconText: 10,
   }

   export const Fonts = {
    baseFont: {
        fontSize: 16,
        fontFamily: "ProximaNovaSemibold"
    },
    screenTitle: {
        fontSize: 24,
        fontFamily: "ProximaNovaSemibold",
    },
    screenTitleSecondary: {
        fontSize: 22,
        fontFamily: "ProximaNovaRegular",
        letterSpacing: -3, 
    },
    sectionTitle: {
        fontSize: 21,
        fontFamily: "ProximaNovaSemibold",
    },
    cardTitle: {
        fontSize: 17,
        fontFamily: "ProximaNovaSemibold",
    },
    cardParagraph: {
        fontSize: 13,
        fontFamily: "ProximaNovaRegular",
    },
    tooltip: {
        fontSize: 13,
        fontFamily: "ProximaNovaRegular",
    },
    spotifyButton: {
        fontSize: 17,
        fontFamily: "ProximaNovaSemibold",
    },
    button: {
        fontSize: 15,
        fontFamily: "ProximaNovaSemibold",
    }
   }

export const Language = {
    english: {
        loginWelcomeTitle: "Welcome to Sonorama!",
        loginWelcomeParagraph: "An application for discovering music and generating playlists catered to your mood and tastes.",
        loginButton: "Log in with Spotify",
        homeGreeting: {
            goodMorning: "Good morning,",
            goodAfternoon: "Good afternoon,",
            goodEvening: "Good evening,",
        },
        homeForYouTitle: "For you",
        homeForYouParagraph: "A daily playlist based on your current obsessions.",
        homePlaylistGenTitle: "Playlist Generator",
        homePlaylistGenParagraph: "Get playlists based on your mood and preferences.",
        homePlaylistGenButton: "Start generating",
    },
    ukrainian: {
        loginWelcomeTitle: "Welcome to Sonorama!",
        loginWelcomeParagraph: "Мобільний додаток для знаходження нової музики та створення плейлістів під ваші смаки та настрій.",
        loginButton: "Увійти з Spotify",
        homeGreeting: {
            goodMorning: "Доброго ранку,",
            goodAfternoon: "Доброго дня,",
            goodEvening: "Доброго вечора,",
        },
        homeForYouTitle: "Для вас",
        homeForYouParagraph: "Щоденний плейліст за вашими улюбленими треками.",
        homePlaylistGenTitle: "Генератор плейлістів",
        homePlaylistGenParagraph: "Згенеруйте плейліст за вашим настроєм та вподобаннями.",
        homePlaylistGenButton: "Почати",
    }
}
   
//    export const Theme = {
//      light: {
//        primary: Colors.primary[900],
//        primaryHighlight: Colors.primary[300],
//        secondary: '#666666',
//        tertiary: '#e0e0e0',
//      },
//      dark: {
//        primary: Colors.primary[300],
//        primaryHighlight: Colors.primary[50],
//        secondary: '#aaaaaa',
//        tertiary: '#666666',
//      },
//    }