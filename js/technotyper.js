(function($){

    //TODO how to do new lines? convert \n or \r or \r\n to <br>?
    //TODO add text onto existing (after a pause you want to add more text for example).

    var _instances = [],
        _static = {
            $window:$(window),
            $html:$('html'),
            $body:$('body'),
            _event_namespace:'TechnoType',
            _next_instance_id:0
        },
        _private = {};

    _static.param = function(parameter,_default) {
        return (typeof parameter !== 'undefined' ? parameter : _default);
    };

    _private.create = function(self) {
        if (self.elements.$container.length) {
            self.elements.$container.append('<span class="technotyper-text"></span><span class="technotyper-cursor"></span>');
            self.elements.$text = self.elements.$container.find('.technotyper-text');
            self.elements.$cursor = self.elements.$container.find('.technotyper-cursor');
            self.elements.$cursor.text(self.settings.cursor);

            self.properties.cursor_interval = setInterval(function(){
                if (self.properties.animating || self.elements.$cursor.css('visibility') != 'visible') {
                    self.elements.$cursor.css('visibility','visible');
                }
                else {
                    self.elements.$cursor.css('visibility','hidden');
                }
            },self.settings.cursor_interval);
        }
    };

    var TechnoTyper = function(settings) { var self = this;
        self.settings = $.extend(true,{},self.default_settings,_static.param(settings,{}));
        self.properties = {
            instance_id:_static._next_instance_id,
            current_text_position:0,
            animating:false,
            type_delay:false, // timer
            type_interval:false, // timer
            cursor_interval:false // timer
        };

        self.elements = {
            $container:$(self.settings.container),
            $text:false,
            $cursor:false
        };

        _private.create(self);

        _instances.push(self);
        _static._next_instance_id++;
    };

    TechnoTyper.prototype.setText = function(text){ var self = this;
        self.settings.text = text;
        self.reset();
    };

    TechnoTyper.prototype.update = function(settings){ var self = this;
        $.extend(true,self.settings,_static.param(settings,{}));
        //TODO finish this
    };

    TechnoTyper.prototype.start = function(delay) { var self = this;
        if (self.elements.$container.length && !self.properties.animating) {

            var start = function(){
                if (self.settings.type_interval > 0) {
                    self.properties.type_interval = setInterval(function(){
                        if (self.settings.text.length > self.properties.current_text_position) {
                            self.elements.$text.text(self.settings.text.substr(0,self.properties.current_text_position+1));
                            self.properties.current_text_position++;
                            self.properties.animating = true;
                            if (self.elements.$cursor.css('visibility') != 'visible') {
                                self.elements.$cursor.css('visibility','visible');
                            }
                        }
                        else {
                            self.stop();
                        }
                    },self.settings.type_interval);
                }
                else {
                    self.elements.$text.text(self.settings.text);
                }
            };

            delay = (typeof delay === "number") ? delay : self.settings.type_delay;

            if (delay > 0) {
                self.properties.type_delay = setTimeout(function(){
                    start();
                    self.properties.type_delay = false;
                },delay);
            }
            else {
                start();
            }
        }
    };

    TechnoTyper.prototype.stop = function() { var self = this;
        if (self.properties.type_interval !== false) {
            clearInterval(self.properties.type_interval);
            self.properties.type_interval = false;
        }

        if (self.properties.type_delay !== false) {
            clearInterval(self.properties.type_delay);
            self.properties.type_delay = false;
        }

        if (self.properties.animating) {
            self.properties.animating = false;
        }
    };

    TechnoTyper.prototype.reset = function() { var self = this;
        self.stop();
        self.elements.$text.text('');
        self.properties.current_text_position = 0;
    };

    TechnoTyper.prototype.version = '1.0.0';
    TechnoTyper.prototype.default_settings = {
        container:false,
        type_interval:50,
        type_delay:1600,
        cursor_interval:500,
        cursor:'_',
        text:''
    };
    TechnoTyper.prototype._static = _static;

    $.TechnoTyper = TechnoTyper;

})(jQuery);