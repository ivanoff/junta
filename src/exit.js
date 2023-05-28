async function onExit(exitHandler) {
    process.on('SIGTERM', exitHandler);
    process.on('SIGQUIT', exitHandler);
    process.on('SIGINT', exitHandler);
    process.on('SIGUSR1', exitHandler);
    process.on('SIGUSR2', exitHandler);
    process.on('exit', exitHandler);
    process.on('uncaughtException', exitHandler);
}

onExit(async () => setTimeout(() => process.exit(0), 1000));
  
export default onExit;
