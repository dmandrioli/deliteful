define(function(){ return '\
/* User vars */\
@media (max-width: 768px) {\
  .d-multi-columns > .d-linear-layout > *:nth-child(n + 2) {\
    display: none;\
  }\
}\
@media (min-width: 768px) and (max-width: 992px) {\
  .d-multi-columns > .d-linear-layout > *:nth-child(n + 2) {\
    display: none;\
  }\
}\
@media (min-width: 992px) and (max-width: 1200px) {\
  .d-multi-columns > .d-linear-layout > :nth-child(n + 4) {\
    display: none;\
  }\
}\
@media (min-width: 1200px) and (max-width: 1600px) {\
  .d-multi-columns > .d-linear-layout > :nth-child(n + 6) {\
    display: none;\
  }\
}\
@media (min-width: 1600px) {\
  .d-multi-columns > .d-linear-layout > :nth-child(n + 6) {\
    display: none;\
  }\
}\
'; } );
