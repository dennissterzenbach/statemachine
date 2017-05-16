var StateConfig = {
    "section1": {
        "type": "StateSection1",
        "next": "section2",
        "name": "section1",
        "selector": "#section1",
        "loader": {
            "name": "DCService"
        }
    },
    "section2": {
        "prev": "section1",
        "next": "section3",
        "name": "section2",
        "selector": "#section2",
        "loader": {
            "name": "DCService"
        }
    },
    "section3": {
        "prev": "section2",
        "next": "section4",
        "name": "section3",
        "selector": "#section3",
        "loader": {
            "name": "DCService"
        }
    },
    "section4": {
        "prev": "section3",
        "next": "section5",
        "name": "section4",
        "selector": "#section4",
        "loader": {
            "name": "DCService"
        }
    },
    "section5": {
        "prev": "section4",
        "name": "section5",
        "selector": "#section5",
        "loader": {
            "name": "DCService"
        }
    }
};
