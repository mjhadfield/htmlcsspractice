
/**
 * Test status helpers
 */

Handlebars.registerHelper('arrayHasValues', function(arr) {
    if (arr == null || arr == undefined) return false;
    return arr.length > 0;
})

Handlebars.registerHelper('isOrganism', function(testConfig) {
    if (!testConfig) return false;
    if (testConfig.testType == 'Organism') return true;
    return false;
})

Handlebars.registerHelper('replaceNewline', function(text) {
    return (text || '').replace(/\\n/g, '\n');
})

Handlebars.registerHelper('isReportable', function(test) {
    const isAuthorised = (test.status == 'A' || test.status == 'P' || test.status == 'C');
    const isInternal = (test.internal || test.testConfig.internal);
    return isAuthorised && !isInternal;
})

Handlebars.registerHelper('notEmpty', function(text) {
    return text !== "" && text !== null && text !== undefined;
})

Handlebars.registerHelper('formatDateTime', function(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate().toString(),
        year = d.getFullYear().toString(),
        hour = d.getHours().toString(),
        minute = d.getMinutes().toString();
        
    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    
    return `${day}/${month}/${year}`;
})

Handlebars.registerHelper('getMaxTime', function(tests) {
    var minDate = null;
    for(i=0; i < tests.length; i++) {
        var d = new Date(tests[i].resultReleasedDate);
        if (d > minDate) minDate = d;
    }
    if (minDate != null) {
        var datestring = minDate.getDate()  + "/" + (minDate.getMonth()+1) + "/" + minDate.getFullYear()
        return datestring;
    } else {
        return 'None'
    }
})

Handlebars.registerHelper('expandStatus', function(status) {
    if (status == 'I') return '** Interim Report **'; // If there are no authorised tests we will not show the profile. This is done in the profileIsReady helper.
    if (status == 'R') return '** Interim Report **';
    if (status == 'P') return '** Interim Report **';
    if (status == 'A') return 'Final Report';
    if (status == 'C') return '** Amended Report **';
})

Handlebars.registerHelper('expandProfileStatus', function(status) {
    if (status == 'I') return 'Incomplete';
    if (status == 'R') return 'Incomplete';
    if (status == 'P') return 'Interim';
    if (status == 'A') return 'Final';
    if (status == 'C') return 'Amended';
})

/**
 * Loop through all the tests in a profile. If any are reportable (authorised and not internal)
 * then return true;
 */
Handlebars.registerHelper('profileIsReady', function(tests) {
    for (var i=0; i<tests.length; i++) {
        const isAuthorised = (tests[i].status == 'A' || tests[i].status == 'P' || tests[i].status == 'C');
        const isInternal = (tests[i].internal || tests[i].testConfig.internal);
        if (isAuthorised && !isInternal) {
            return true;
        }
    }
    return false;
})

/**
 * This function returns the profile status displayed at the top of each profile (ie. Interim, Final)
 */
Handlebars.registerHelper('calculateProfileStatus', function(tests) {
    let hasAuthorised = false;
    let hasIncomplete = false;
    let hasPreliminary = false;
    for (var i=0; i<tests.length; i++) {
        const isAuthorised = (tests[i].status == 'A' || tests[i].status == 'P' || tests[i].status == 'C');
        const isPreliminary = tests[i].status == 'P';
        const isIncomplete = tests[i].status == 'I'
        const isInternal = (tests[i].internal || tests[i].testConfig.internal);
        const isOptional = tests[i].testConfig.optional;

        if (isAuthorised && !isInternal) {
            hasAuthorised = true;
        }
        if (isIncomplete && !isOptional) {
            hasIncomplete = true;
        }
        if (isPreliminary) {
            hasPreliminary = true;
        }
    }
    
    if (hasAuthorised && (hasIncomplete || hasPreliminary)) return '** Interim **';
    if (hasAuthorised && !hasIncomplete) return 'Final';
})

Handlebars.registerHelper('calculateReportStatus', function(profiles) {
    var hasAuthorised = false;
    var hasUnauthorised = false;

    for (var i = 0; i < profiles.length; i++) {
        var status = profiles[i].status;
        if (status == 'A' || status == 'C') hasAuthorised = true;
        if (status == 'I' || status == 'R') hasUnauthorised = true;
    }

    if (hasAuthorised == true && hasUnauthorised == false) return "Authorised Report";
    if (hasAuthorised == true && hasUnauthorised == true) return "** Partially Authorised Report **";
    if (hasAuthorised == false && hasUnauthorised == true) return "** Interim Report **";
})

Handlebars.registerHelper('isAbnormal', function(abnormalFlag) {
    return abnormalFlag != null && abnormalFlag != "N";
})



// TODO: Don't show profile if there are no resulted content

Handlebars.registerHelper('isVisibleLegacy', function(resultLine) {
    if (resultLine.testType == 'Profile') return false;
    if (resultLine.internal) return false;
    if (!resultLine.result) return false;
    return true;
})