// The init function is called on both the server and browser
// before rendering
exports.init = function(model) {
    var self = this;         
}

// The create function is called after the component is created
// and has been added to the DOM. It only runs in the browser
exports.create = function(model, dom) {        
    var self = this, 
        searchq, 
        keywords,
        path,
        field;
        
    // get path name for lookup 
    path = model.get('path'); 

    // get field name to store selections
    field = model.at('field'); 
       
    // Reference list for selected items
    model.refList('_selectedItems',path, field);

    model.set('_searchq','');

    // input element
    this.input = dom.element('searchinput');
    
    // container div
    this.container = dom.element('searchcontainer');
       
    // display/hide menu/response list indicator
    this.display = model.at('_display')
    
    // Add 'focused' class to the container and menu divs
    this.setFocusCls = function() {
        if (!hasClass(self.container,'focused')) addClass(self.container,'focused')                
    }
       
    // Remove 'focused' class from the container and menu divs
    this.delFocusCls = function() {
        if (hasClass(self.container,'focused')) removeClass(self.container,'focused')        
        self.display.set('none'); // hide response list
    }
    
    // Focus input; we're going to use this to set focus on the input element,
    // in addition to setting the 'focused' class on the containing div
    this.focusInput = function() {
        self.input.focus();
        self.display.set('block'); // show response list
    }    
        
    // Push item id to selected values, empty the input field and response
    this.selectItem = function(e) {
        var id;
        id = this.model.at(e.target).get('id'); // fetch item id
        field.push(id); // push selected value        
        model.set('_response',[]); // clear response list 
        self.input.value = ''; // empty text input 
        
        self.focusInput();
        self.setFocusCls();
        
    }

    // Delete item
    this.deleteItem = function(e) {
        return model.at(e.target).remove();
    }        
    
    // Listen to click events so we could remove the "focused" class 
    // as well as hide the results menu if target element is neither our input 
    // or container.
    dom.addListener(document.documentElement, 'click', function(e) {        
        if (e.target !== self.container && 
            e.target !== self.input && 
            !hasClass(e.target, 'selection-text') && 
            !hasClass(e.target, 'selection-item')) self.delFocusCls();
        
    })
        
   
    // Listen to _searchq value changes 
    model.on('set','_searchq', function() {                
        // Get _searchq value and trim spaces
        searchq = trim(model.get('_searchq'));
        
        // Empty result list if search string is empty
        if (!searchq) {
            model.ref('_response',[]);
            return;
        }
        
        // Split words
        keywords = searchq.split(" ");                        
                
                                
        // Filter the subscribed path and create a view reference
        model.ref('_p',path);
        model.ref('_response',model.filter('_p').where('keywords').contains(keywords));        
     });        
}


// check if a DOM element has an existing class
function hasClass(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

// add class to a DOM element
function addClass(ele,cls) {
        if (!hasClass(ele,cls)) ele.className += " "+cls;
}

// remove class from a DOM element
function removeClass(ele,cls) {
        if (hasClass(ele,cls)) {
                var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
                ele.className=ele.className.replace(reg,' ');
        }
}    

// Trim whitespaces
function trim(s) {
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');        
}
