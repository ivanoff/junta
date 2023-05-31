// list of well-known processes and processes that restart periodically
export default [
    /^\/usr\/share\/code\/code/,
    /^\/opt\/google\/chrome\/chrome/,
    /^\/usr\/share\/code\/chrome_crashpad_handler/,
    /^\/usr\/bin\/docker-proxy/,
    /^\/opt\/google\/chrome\/chrome/,
    /^(\/bin\/sh -c )?ps aux/,
    /^\[kworker\//,
    /^sshd: \[\w+\]/,
    /^sshd: root \[\w+\]/,
    /^sshd: unknown \[\w+\]/,
    /^sshd: \/usr\/sbin\/sshd -D \[listener\]/,
    /^sleep/,
    /^netstat -tulpn$/,
    /^\/bin\/sh -c netstat -tulpn$/,
    /^\[sh\]( <defunct>)?$/,
    /^\[netstat\]( <defunct>)?$/,
    /^local -t unix$/,
    /^dovecot\/(imap|quota|lmtp|auth)/,
    /^tlsproxy/,
    /^dnsblog/,
    /^smtpd? -n (submission|smtp-amavis|127\.0\.0\.1:\d+) -t (inet|unix) -u/,
    /^smtpd? -t pass -u -o/,
    /^bounce -z -n defer -t unix/,
    /^cleanup -z -t unix -u -c/,
    /^pickup -l -t fifo/,
    /^spawn -z -n policyd-spf/,
    /^\/usr\/bin\/python3 \/usr\/bin\/policyd-spf/,
    /^\/usr\/sbin\/amavisd-new/,
    /^proxymap -t unix -u/,
    /^anvil -l -t unix -u -c/,
    /^postscreen -l -n smtp -t inet/,
    /^lmtp -t unix -u/,
    /^trivial-rewrite -n rewrite/,
    /^\/lib\/systemd\/systemd-udevd/,
    /^postgres: postgres postgres .* idle$/,
];
