/**
 * Created by Phil on 13/11/2015.
 *
 * Aims:
 * - Amount of wins for each owner when playing all other owners schedules
 * - Best/worst result per team
 * - Team quality - Average amount of wins for each team across all schedules
 * - Schedule difficulty - Average amount of wins for each schedule
 *
 */

var data = require("./2017.json");

var team_scores = data.team_scores;
var schedule = data.schedule;

var ownerPossibilities = {
    "phil" : {
        "Playing each schedule" : {}
    },
    "doug" : {
        "Playing each schedule" : {}
    },
    "tubb" : {
        "Playing each schedule" : {}
    },
    "gav" : {
        "Playing each schedule" : {}
    },
    "pete" : {
        "Playing each schedule" : {}
    },
    "marcus" : {
        "Playing each schedule" : {}
    },
    "saunders" : {
        "Playing each schedule" : {}
    },
    "roey" : {
        "Playing each schedule" : {}
    }
};

// Calculate each teams record when playing everyone else's schedules
for (var ownerName in team_scores) {
    if (team_scores.hasOwnProperty(ownerName)) {

        var scoresArray = team_scores[ownerName];

        var highMark = 0;
        var highName = [];
        var lowMark = 16;
        var lowName = [];

        // For each possible schedule, work out how the current owner will do
        for (var scheduleKey in schedule) {
            if (schedule.hasOwnProperty(scheduleKey)) {

                var winCount = 0;
                var lossCount = 0;
                var scheduleArray = schedule[scheduleKey];

                for (var i = 0; i < scoresArray.length; i++) {
                    var ownerScore = scoresArray[i];
                    var thisWeeksOpponent = scheduleArray[i];
                    var opponentScore = team_scores[thisWeeksOpponent][i];

                    if (ownerScore - opponentScore > 0) {
                        winCount++;
                    } else {
                        lossCount++;
                    }
                }

                // Track high water mark for summary
                if (winCount > highMark) {
                    highMark = winCount;
                    highName = [];
                    highName.push(scheduleKey);
                }
                else if (winCount === highMark) {
                    highName.push(scheduleKey);
                }

                // Track low water mark for summary
                if (winCount < lowMark) {
                    lowMark = winCount;
                    lowName = [];
                    lowName.push(scheduleKey);
                }
                else if (winCount === lowMark) {
                    lowName.push(scheduleKey);
                }

                //if (scheduleKey === ownerName) {
                //    scheduleKey = 'Actual outcome';
                //}
                ownerPossibilities[ownerName]["Playing each schedule"][scheduleKey] = winCount;
            }
        }
        ownerPossibilities[ownerName]["Playing each schedule"]["Best outcome"] = highMark + " playing the schedule of " + JSON.stringify(highName);
        ownerPossibilities[ownerName]["Playing each schedule"]["Worst outcome"] = lowMark + " playing the schedule of " + JSON.stringify(lowName);
    }
}


// Work out the best and worst records with each schedule
// Find how each person performed with my schedule and record min/max/mean
for (var ownerName in team_scores) {
    if (team_scores.hasOwnProperty(ownerName)) {

        var highMark = 0;
        var highName = [];
        var lowMark = 16;
        var lowName = [];
        var average = 0;

        for (var ownerNameInternal in team_scores) {
            if (team_scores.hasOwnProperty(ownerNameInternal)) {
                var winCount = ownerPossibilities[ownerNameInternal]["Playing each schedule"][ownerName];

                // Track high water mark for summary
                if (winCount > highMark) {
                    highMark = winCount;
                    highName = [];
                    highName.push(ownerNameInternal);
                }
                else if (winCount === highMark) {
                    highName.push(ownerNameInternal);
                }

                // Track low water mark for summary
                if (winCount < lowMark) {
                    lowMark = winCount;
                    lowName = [];
                    lowName.push(ownerNameInternal);
                }
                else if (winCount === lowMark) {
                    lowName.push(ownerNameInternal);
                }

                average += winCount;
            }
        }
        ownerPossibilities[ownerName]["Other people playing this schedule"] = {
            "Best result" : highMark + " achieved by " + JSON.stringify(highName),
            "Worst result" : lowMark + " achieved by " + JSON.stringify(lowName),
            "Average result" : average/Object.keys(team_scores).length
        }
    }
}

// Work out the hardest and easiest schedule
var avgHighMark = 0;
var avgHighName = [];
var avgLowMark = 16;
var avgLowName = [];

for (var ownerName in team_scores) {
    if (team_scores.hasOwnProperty(ownerName)) {
        var thisOwnerAverage = ownerPossibilities[ownerName]["Other people playing this schedule"]["Average result"];

        // Track high water mark for summary
        if (thisOwnerAverage > avgHighMark) {
            avgHighMark = winCount;
            avgHighName = [];
            avgHighName.push(ownerName);
        }
        else if (thisOwnerAverage === avgHighMark) {
            avgHighName.push(ownerName);
        }

        // Track low water mark for summary
        if (thisOwnerAverage < avgLowMark) {
            avgLowMark = winCount;
            avgLowName = [];
            avgLowName.push(ownerName);
        }
        else if (thisOwnerAverage === avgLowMark) {
            avgLowName.push(ownerName);
        }
    }
}

ownerPossibilities["Hardest schedule"] = JSON.stringify(avgHighName) + " with an average of " + avgHighMark + " wins";

console.log(ownerPossibilities);