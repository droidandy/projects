import { spawn } from 'child_process';

const commandLineArgs = process.argv.slice(2);
if (commandLineArgs.length == 0) {
  console.error('command-name argument is obligatory');
  process.exit(1);
}

const commandName: string = commandLineArgs[0];
const clusterName = commandLineArgs.length > 1 ? commandLineArgs[1] : 'aou-backend';
const clusterRegistryName = `${clusterName}-registry`;

var apolloExternalPort: string = '';
var hasuraExternalPort: string = '';
var addCommandLineArgs: string = '';
if (commandName === 'k3d:create') {
  apolloExternalPort = commandLineArgs.length > 2 ? commandLineArgs[2] : '18300';
  hasuraExternalPort = commandLineArgs.length > 3 ? commandLineArgs[3] : '18808';
  if (commandLineArgs.length > 4) {
    addCommandLineArgs = commandLineArgs.slice(4).join(' ');
  }
} else if (commandLineArgs.length > 2) {
  addCommandLineArgs = commandLineArgs.slice(2).join(' ');
}
if (addCommandLineArgs.length > 0) {
  addCommandLineArgs = ' ' + addCommandLineArgs;
}

type ExecParams = {
  cmds: string[],
  options?: any,
};

type ExecParamsMap = {
  [key: string]: ExecParams,
};

const commandNameToExecParamsMap: ExecParamsMap = {
  'k3d:create': {
    cmds: [
      `k3d cluster create ${clusterName} --k3s-arg "--no-deploy=traefik@server:*" --registry-create ${clusterRegistryName}${addCommandLineArgs}`,
      `k3d cluster edit ${clusterName} --port-add ${apolloExternalPort}:3000@loadbalancer`,
      `k3d cluster edit ${clusterName} --port-add ${hasuraExternalPort}:8080@loadbalancer`,
      `k3d cluster edit ${clusterName} --port-add 7432:5432@loadbalancer`,
      `k3d cluster start ${clusterName}`,
    ],
    options: {
      'shell': true,
    },
  },
  'k3d:delete': {
    cmds: [
      `k3d cluster delete ${clusterName}${addCommandLineArgs}`,
    ],
  },
  'k3d:start': {
    cmds: [
      `k3d cluster start ${clusterName}${addCommandLineArgs}`,
    ],
  },
  'k3d:stop': {
    cmds: [
      `k3d cluster stop ${clusterName}${addCommandLineArgs}`,
    ],
  },
  'tilt:up': {
    cmds: [
      `k3d cluster start ${clusterName}`,
      `tilt up${addCommandLineArgs}`,
    ],
    options: {
      'cwd': './products',
      'env': {
        ...process.env,
        'CLUSTER_REGISTRY_NAME': clusterRegistryName,
      },
      'stdio': [process.stdin, process.stdout, process.stderr],
    },
  },
  'tilt:down': {
    cmds: [
      `tilt down${addCommandLineArgs}`,
    ],
    options: {
      'cwd': './products',
      'env': {
        ...process.env,
        'CLUSTER_REGISTRY_NAME': clusterRegistryName,
      },
      'stdio': [process.stdin, process.stdout, process.stderr],
    },
  },
};

if (!(commandName in commandNameToExecParamsMap)) {
  console.error(`command is unknown: ${commandName}`);
}
var execParamsMap = commandNameToExecParamsMap[commandName];
if (!('options' in execParamsMap)) {
  execParamsMap.options = {};
}

type ErrorCallbackFunction = (err: any) => void;

type ExecOptions = {
  [key: string]: any;
};

const execCmd = (cmd: any, options: ExecOptions = {}, errorCallback?: ErrorCallbackFunction) => {
  var parts = cmd.split(/\s+/g);
  var p = spawn(parts[0], parts.slice(1), {stdio: 'inherit', ...options});
  p.on('exit', (code) => {
    var err = null;
    if (code) {
      err = new Error('command "'+ cmd +'" exited with wrong status code "'+ code +'"');
    }
    if (errorCallback) {
      errorCallback(err);
    }
  });
};


const series = (cmds: string[], options: ExecOptions = {}, errorCallback: ErrorCallbackFunction) => {
  var execNext = () => {
    execCmd(cmds.shift(), options, (err: any) => {
      if (err) {
        errorCallback(err);
      } else {
        if (cmds.length) {
          execNext();
        } 
        else {
          process.exit(0);
        } 
      }
    });
  };
  execNext();
};


series(execParamsMap['cmds'], execParamsMap['options'],
  (err) => {
    console.error(err);
    process.exit(1);
  }
);