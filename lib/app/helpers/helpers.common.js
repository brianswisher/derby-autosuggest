////////////////////////////////////////////////////////////////////////////////
// DECLARATIONS
////////////////////////////////////////////////////////////////////////////////
_ref = app = require('../index'), view = _ref.view;

////////////////////////////////////////////////////////////////////////////////
// VIEW HELPERS
////////////////////////////////////////////////////////////////////////////////

// Remove all whitespace from a string
view.fn('unspace', function(s) {
    return s && s.replace(/\s/g, '');
});

// Capitalize string
view.fn('capitalize', function(s) {
    return s && s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
});

// Display full month
view.fn('valueText', function(val, arr) {   
    for (var i=0;i<arr.length;i++) {
        if (arr[i].value==val) return arr[i].text;
    }    
    return val;   
});

// Display birthday
view.fn('valueDay', function(d) {    
    if (d==1) { return '1st'};
    if (d==2) { return '2nd'};
    
    return d;
});

// Display full birthday
view.fn('showBirthday', function(display) {    
    if (display=='N') return false;
    return true;
});

// Display birthday year
view.fn('showBirthdayYear', function(display) {    
    if (display=='Y') return true;
    return false;
});

