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
        
                                                     
        // Create a private path for the text input query
        model.set('_searchq','');

        // Reference list for selected countries
        model.refList('_selectedCountries','countries','_user.countryIds');

           
        // Page render context
        var ctx = {
            title: 'Auto suggest example',
            cls: "autoSuggestBox"
        }                
        return page.render('main', ctx);    
    });         
});


// A simple router for displaying stored data in a different view
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
    var searchq, ccc, favcountries, keywords, query;
    
    // Listen to _searchq value changes 
    model.on('set','_searchq', function() {

        // Get _searchq value and trim spaces
        searchq = util.trim(model.get('_searchq'));
        
        // Empty result list if search string is empty
        if (!searchq) {
            model.set('_countries',[]);
            return;
        }
        
        // Split words
        keywords = searchq.split(" ");                        
                                
        /* For small data sets it's better to load the whole model data into 
         * and filter the data client-side using model.filter(), in this case
         * that would be                             
         * model.filter('countries').where('keywords').contains(keywords)
         * 
         * Filtering should've been used in this case, however, for some reason
         * Racer returns an array of "undefined" objects; though the number of
         * items in the array is correct. Possible Racer issue? Feedbacks
         * are welcome.
         */
                
        query = model.query('countries').getCountryList(keywords);        

        model.fetch(query, function (err, countries) {
            model.ref('_countries', countries);
        });

    });  


    
})


////////////////////////////////////////////////////////////////////////////////
// RENDER CALLBACK
////////////////////////////////////////////////////////////////////////////////
_ref.on('render', function(ctx) { 
    // Do nothing
});
