requirejs.config({
  "baseUrl": "js/lib",
  "paths": {
    "app": "../app",
    "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",
    "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min",
    "ramda": "//cdnjs.cloudflare.com/ajax/libs/ramda/0.10.0/ramda.min",
    "jquery.validate": "//cdn.jsdelivr.net/jquery.validation/1.14.0/jquery.validate.min",
    "jquery.migrate": "//code.jquery.com/jquery-migrate-1.2.1.min",
    "persona": "//login.persona.org/include"
  },
  "shim": {
    "bootstrap": {
      deps: ["jquery"],
      exports: '$.fn.collapse'
    },
    "jquery.migrate": {
      deps: ["jquery"]
    },
    "jquery.validate": {
      deps: ["jquery"],
      exports: "jQuery.fn.validate"
    },
    "jquery.ba-hashchange.min": {
      deps: ["jquery", "jquery.migrate"],
      exports: "jQuery.fn.hashchange"
    },
    "jquery.serializeObject": {
      deps: ["jquery"],
      exports: "jQuery.fn.serializeObject"
    },
    "persona": {
      exports: "navigator"
    },
    "jsrender": {
      deps: ["jquery"]
    }
  }
});