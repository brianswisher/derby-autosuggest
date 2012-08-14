////////////////////////////////////////////////////////////////////////////////
// DECLARATIONS
////////////////////////////////////////////////////////////////////////////////

var  derby = require('derby'), 
    app = derby.createApp(module),  
    get = app.get,  
    ready = app.ready, 
    view = app.view,
    util= require('./exports/exports.util').util; // expose our util object

////////////////////////////////////////////////////////////////////////////////
// MODULES
////////////////////////////////////////////////////////////////////////////////
derby.use(require('derby-ui-boot'))
derby.use(require('../../ui'))


////////////////////////////////////////////////////////////////////////////////
// VIEW HELPERS
////////////////////////////////////////////////////////////////////////////////
require('./helpers/helpers.common');

////////////////////////////////////////////////////////////////////////////////
// ROUTE(S)
////////////////////////////////////////////////////////////////////////////////

// Render /. Pay attention to ctx.cls, that's the class we're sending to our
// autoSuggest component. That's it, simple stuff.
get('/', function(page, model, params) {       
    return model.subscribe('countries', 'users.0', function(err, countries, user) {           
        // Prepoulate only of collection is empty
        // Racer might throw an error "Model bundling took longer than..." this
        // will probably be fixed in in 0.3.13. Until then, data will be 
        // partially added to the collection.                
        if (util.isEmptyObj(countries.get())) { // check if collection is empty
            var guid, 
                countryData=util.getCountryData(); // get default country data
            
            for (var i=0;i<countryData.length;i++) {                
                guid = model.id(); // generate a unique ID
                countries.set(guid, countryData[i]);
            }
        }
       
        // Reference to the users.0 path
        model.ref('_user', user);

        // Set defaults if empty
        model.setNull('_user.countryIds',[]);
        model.setNull('_user.name','');     
        
               
        // Page render context
        var ctx = {
            title: 'Auto suggest example',
            cls: "autoSuggest"
        }                
        return page.render('main', ctx);       
    });             
});


// A simple router for displaying stored data in a different view. 
// Run this first to make sure data is populated; typically we'd populate
// and store static data separately to avoid an extra call to mongo 
// each time the app runs
get('/list', function(page, model, params) {       
    return model.subscribe('countries', 'users.0', function(err, countries, user) {           
        model.ref('_user', user);
        model.refList('_selectedCountries','countries','_user.countryIds');                
        
        var ctx = {
            title: 'Auto suggest example'
        }                
        return page.render('list', ctx);    
    });         
});






////////////////////////////////////////////////////////////////////////////////
// SHARED LOGIC
////////////////////////////////////////////////////////////////////////////////
ready(function(model) {    
    // Really nothing to do! The autoSuggest component is so simple to use now :)
})


////////////////////////////////////////////////////////////////////////////////
// RENDER CALLBACK
////////////////////////////////////////////////////////////////////////////////
_ref.on('render', function(ctx) { 
    // Do nothing
});
