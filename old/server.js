var Database = require('./Database'),
    Sockets = require('./Sockets'),
    ChatSockets = require('./Chat/Sockets'),
    Login = require('./logics/Login'),
    Disconnect = require('./logics/Disconnect'),
    Initial = require('./logics/Initial');

Database.setup();
Initial.setup();
Sockets.setup();
ChatSockets.setup();
Login.setup();
Disconnect.setup();
