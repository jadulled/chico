
/**
 * TabNavigator UI-Component for static and dinamic content.
 * @name TabNavigator
 * @class TabNavigator
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */

ch.tabNavigator = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.TabNavigator
     */
	var that = this;

	conf = ch.clon(conf);

	that.conf = conf;
	
/**
 *	Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

    /**
     * Reference to the tabNavigator's triggers.
     * @private
     * @name ul
     * @type {jQuery Object}
     * @memberOf ch.TabNavigator
     */
	//var ul = that.$element.children(':first').addClass('ch-tabNavigator-triggers');
    /**
     * The actual location hash, is used to know if there's a specific tab selected.
     * @private
     * @name hash
     * @type {String}
     * @memberOf ch.TabNavigator
     */
	var hash = window.location.hash.replace("#!", "");
    /**
     * A boolean property to know if the some tag should be selected.
     * @private
     * @name hashed
     * @type {Boolean}
     * @default false
     * @memberOf ch.TabNavigator
     */
    var hashed = false;
    /**
     * Get wich tab is selected.
     * @private
     * @name selected
     * @type {Number}
     * @memberOf ch.TabNavigator
     */
    var selected = conf.selected - 1 || conf.value - 1 || 0;
    /**
     * """"""""""""""""""""
     * @private
     * @name createTabs
     * @type {""""""}
     * @memberOf ch.TabNavigator
     */
	var createTabs = function(){

		// Children
		that.$element.children().eq(0).find("a").each(function(i, e){

			// Tab context
			var tab = {};
				tab.uid = that.uid + "#" + i;
				tab.type = "tab";
				tab.element = e;
				tab.$element = $(e);

			// Tab configuration
			var conf = {};
				conf.open = (selected == i);
				conf.onShow = function(){
					selected = i;
				};

			// Callbacks
			if ( that.conf.hasOwnProperty("onContentLoad") ) conf.onContentLoad = that.conf.onContentLoad;
			if ( that.conf.hasOwnProperty("onContentError") ) conf.onContentError = that.conf.onContentError;

			// Create Tabs
			that.children.push(
				ch.tab.call(tab, conf)
			);

			// Bind new click to have control
			$(e).unbind("click").bind("click", function(event){
				that.prevent(event);
				select(i + 1);
			});

		});

		return;

	};

	var select = function(tab){

		tab = that.children[tab - 1];
		
		if(tab === that.children[selected]) return; // Don't click me if I'm open

		// Hide my open bro
		$.each(that.children, function(i, e){
			if(tab !== e) e.hide();
		});

		tab.show();

        //Change location hash
		window.location.hash = "#!" + tab.$content.attr("id");	
		
		// Callback
		that.callbacks("onSelect");
		
        return that;
	};

/**
 *  Protected Members
 */ 

 	//that.$trigger = ul.find('a');
	//that.$content = ul.next().addClass('ch-tabNavigator-content box');

	that.$content = that.$element.children().eq(1).addClass("ch-tabNavigator-content box");

    
/**
 *  Public Members
 */

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.TabNavigator
     */
	that["public"].uid = that.uid;
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.TabNavigator
     */
	that["public"].element = that.element;
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.TabNavigator
     */
	that["public"].type = that.type;
    /**
     * Children instances associated to this controller.
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.TabNavigator
     */
	that["public"].children = that.children;
    /**
     * Select a specific child.
     * @public
     * @function
     * @name select
     * @param {Number} tab Tab's index.
     * @memberOf ch.TabNavigator
     */
	that["public"].select = function(tab){
		select(tab);
		
		return that["public"];
	};
    /**
     * Returns the selected child's index.
     * @public
     * @function
     * @name getSelected
     * @return {Number} selected Tab's index.
     * @memberOf ch.TabNavigator
     */	
	that["public"].getSelected = function(){ return selected; };

/**
 *  Default event delegation
 */	

    	that.$element.addClass('ch-tabNavigator');

	createTabs();

	//Default: Load hash tab or Open first tab	
	for(var i = that.children.length; i--; ){
		if ( that.children[i].$content.attr("id") === hash ) {
			select(i + 1);
			
			hashed = true;
			
			break;
		};
	};

	return that;
	
};



/**
 * Simple unit of content for TabNavigators.
 * @name Tab
 * @class Tab
 * @augments ch.Navs
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */

ch.tab = function(conf){
    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Tab
     */
    var that = this;

	conf = ch.clon(conf);
	conf.icon = false;
	
	that.conf = conf;

	
/**
 *	Inheritance
 */

	that = ch.navs.call(that);
	that.parent = ch.clon(that);

/**
 *  Private Members
 */

	var createContent = function(){
		var href = that.element.href.split("#");
		var controller = that.$element.parents(".ch-tabNavigator");
		var content = controller.find("#" + href[1]);
		
		// If there are a tabContent...
		if ( content.length > 0 ) {
			
			return content;
		
		// If tabContent doesn't exists        
		} else {
			// Set ajax configuration
			conf.ajax = true;

			// Create tabContent
			return $("<div>")
				.attr("id", (href.length == 2) ? href[1] : "ch-tab" + that.uid.replace("#","-") )
				.addClass("ch-hide")
				.appendTo( controller.children().eq(1) );
		};

	};

/**
 *  Protected Members
 */ 
    /**
     * Reference to the trigger element.
     * @private
     * @name $trigger
     * @type {jQuery Object}
     * @memberOf ch.Tab
     */
	that.$trigger = that.$element;

    /**
     * The component's content.
     * @private
     * @name $content
     * @type {jQuery Object}
     * @memberOf ch.Tab
     */	
	that.$content = createContent();

    /**
     * Process the show event.
     * @private
     * @function
     * @name show
     * @return {jQuery Object}
     * @memberOf ch.Tab
     */ 
	that.show = function(event){
		that.prevent(event);

		// Load my content if I'need an ajax request 
		if( that.$content.html() == "" ) that.$content.html( that.loadContent() );

		// Show me
		that.parent.show(event);
		
		return that;
	};

/**
 *  Public Members
 */
	
	
/**
 *  Default event delegation
 */

	that.configBehavior();

	
	return that;
}
