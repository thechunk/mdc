
exports.testApp = function (req, res) {
    'use strict';
    res.render('index', { title: 'Express' });
};

exports.envVars = function (req, res) {
    'use strict';
    res.render('OpenShiftEnvVars.hbs',
        {
            myAppDns: process.env.OPENSHIFT_APP_DNS,
            myAppName: process.env.OPENSHIFT_APP_NAME,
            myAppUUID: process.env.OPENSHIFT_APP_UUID,
            myAppIP: process.env.OPENSHIFT_NODEJS_IP,
            myAppPort: process.env.OPENSHIFT_NODEJS_PORT,
            myHomeDir: process.env.OPENSHIFT_HOMEDIR,
            myRepoDir: process.env.OPENSHIFT_REPO_DIR,
            myDataDir: process.env.OPENSHIFT_DATA_DIR,
            myLogDir: process.env.OPENSHIFT_LOG_DIR,
            myTmpDir: process.env.OPENSHIFT_TMP_DIR,
            nodeDir: process.env.OPENSHIFT_NODEJS_DIR,
            nodeLdLibDir: process.env.OPENSHIFT_NODEJS_LD_LIBRARY_PATH_ELEMENT,
            nodeLogDir: process.env.OPENSHIFT_NODEJS_LOG_DIR,
            nodePath: process.env.OPENSHIFT_NODEJS_PATH_ELEMENT,
            nodePidDir: process.env.OPENSHIFT_NODEJS_PID_DIR,
            gearDns: process.env.OPENSHIFT_GEAR_DNS,
            gearMem: process.env.OPENSHIFT_GEAR_MEMORY_MB,
            gearName: process.env.OPENSHIFT_GEAR_NAME,
            gearUUID: process.env.OPENSHIFT_GEAR_UUID
        }
        );
};