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
