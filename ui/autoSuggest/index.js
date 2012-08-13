// The init function is called on both the server and browser
// before rendering
exports.init = function(model) {

}

// The create function is called after the component is created
// and has been added to the DOM. It only runs in the browser
exports.create = function(model, dom) {        
    var self = this;
          
    // input element
    this.input = dom.element('searchinput');
    
    // container div
    this.container = dom.element('searchcontainer');

    // autosuggest wrapper
    this.wrapper = dom.element('autosuggest');
       
    // display/hide menu/response list indicator
    this.display = model.at('display')

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
        
    // Listen to click events so we could remove the "focused" class 
    // as well as hide the results menu if target element is neither our input 
    // or container.
    dom.addListener(document.documentElement, 'click', function(e) {        
        console.log(e.target);
        if (e.target !== self.container && 
            e.target !== self.input && 
            !hasClass(e.target, 'selection-text') && 
            !hasClass(e.target, 'selection-item')) self.delFocusCls();
        
    })

    // Push item id to selected values, empty the input field and response
    this.selectItem = function(e) {
        var id;
        id = this.model.at(e.target).get('id'); // fetch item id
        model.push('valuefield',id); // push selected value
        model.set('searchq',''); // clear search input value
        model.set('response',[]); // clear response list 
        
        self.focusInput();
        self.setFocusCls();
        
    }

    // Delete item
    this.deleteItem = function(e) {
        return model.at(e.target).remove();
    }
    
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

