define(function(){ return '\
/* User vars */\
.d-multi-columns {\
  display: block;\
  overflow-x: hidden;\
  overflow-y: hidden;\
}\
.-d-multi-columns-animate {\
  -moz-transition: -moz-transform 0.3s ease-in-out;\
  -webkit-transition: -webkit-transform 0.3s ease-in-out;\
  -ms-transition: -mstransform 0.3s ease-in-out;\
  transition: transform 0.3s ease-in-out;\
}\
.-d-multi-columns-hidden {\
  display: none;\
  visibility: hidden;\
}\
@media screen and (max-width: 768px) {\
  .d-multi-columns > .d-linear-layout > .-d-multi-columns-mq:nth-child(n + 2) {\
    display: none;\
  }\
}\
@media screen and (min-width: 768px) and (max-width: 992px) {\
  .d-multi-columns > .d-linear-layout > .-d-multi-columns-mq:nth-child(n + 2) {\
    display: none;\
  }\
}\
@media screen and (min-width: 992px) and (max-width: 1200px) {\
  .d-multi-columns > .d-linear-layout > .-d-multi-columns-mq:nth-child(n + 4) {\
    display: none;\
  }\
}\
@media screen and (min-width: 1200px) {\
  .d-multi-columns > .d-linear-layout > .-d-multi-columns-mq:nth-child(n + 6) {\
    display: none;\
  }\
}\
'; } );
