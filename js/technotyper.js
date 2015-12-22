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
        if (self.properties.$container.length) {
            self.properties.$container.append('<span class="technotyper-text"></span><span class="technotyper-cursor"></span>');
            self.properties.$text = self.properties.$container.find('.technotyper-text');
            self.properties.$cursor = self.properties.$container.find('.technotyper-cursor');

            self.properties.cursor_blink_interval = setInterval(function(){
                if (!self.properties.animating && self.properties.$cursor.text() != self.settings.cursor) {
                    self.properties.$cursor.text(self.settings.cursor);
                }
                else {
                    self.properties.$cursor.text('');
                }
            },self.settings.cursor_blink_interval);
        }
    };

    var TechnoTyper = function(settings) { var self = this;
        self.settings = $.extend(true,{},self.default_settings,_static.param(settings,{}));
        self.properties = {
            $container:$(self.settings.container),
            $text:false,
            $cursor:false,
            instance_id:_static._next_instance_id,
            current_text_position:0,
            animating:false,
            type_interval:false, // timer
            cursor_blink_interval:false // timer
        };

        _private.create(self);

        _instances.push(self);
        _static._next_instance_id++;
    };

    TechnoTyper.prototype.setText = function(text){ var self = this;
        self.settings.text = text;
    };

    TechnoTyper.prototype.update = function(settings){ var self = this;
        $.extend(true,self.settings,_static.param(settings,{}));
    };

    TechnoTyper.prototype.start = function() { var self = this;
        if (self.properties.$container.length && !self.properties.animating) {
            if (self.settings.type_interval > 0) {
                self.properties.type_interval = setInterval(function(){
                    if (self.settings.text.length > self.properties.current_text_position) {
                        self.properties.$text.text(self.settings.text.substr(0,self.properties.current_text_position+1));
                        self.properties.current_text_position++;
                    }
                    else {
                        self.stop();
                    }
                },self.settings.type_interval);
            }
            else {
                self.properties.$text.text(self.settings.text);
            }

            self.properties.animating = true;
        }
    };

    TechnoTyper.prototype.stop = function() { var self = this;
        if (self.properties.$container.length && self.properties.animating) {
            if (self.properties.type_interval !== false) {
                clearInterval(self.properties.type_interval);
                self.properties.type_interval = false;
            }

            self.properties.animating = false;
        }
    };

    TechnoTyper.prototype.reset = function() { var self = this;
        self.stop();
        self.properties.$text.text('');
    };

    TechnoTyper.prototype.version = '3.0.0';
    TechnoTyper.prototype.default_settings = {
        container:false,
        type_interval:50,
        cursor_blink_interval:500,
        cursor:'_',
        text:''
    };
    TechnoTyper.prototype._static = _static;

    $.TechnoTyper = TechnoTyper;

})(jQuery);