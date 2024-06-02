const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ssPredictor(RNASequence) {
    const n = RNASequence.length;
    const OPT = Array.from({ length: n + 1 }, () => Array.from({ length: n + 1 }, () => []));

    for (let i = 1; i <= n; i++) {
        for (let j = i; j <= n && j <= i + 4; j++) {
            OPT[i][j] = [];
        }
    }

    for (let k = 5; k <= n - 1; k++) {
        for (let i = 1; i <= n - k; i++) {
            const j = i + k;
            const jthBase = RNASequence[j - 1];

            const firstArg = OPT[i][j - 1];
            const firstArgSize = firstArg.length;

            let secArg = [];
            let secArgSize = 0;

            for (let t = i; t <= j - 5; t++) {
                const tthBase = RNASequence[t - 1];
                if ((tthBase === 'A' && jthBase === 'U') || (tthBase === 'U' && jthBase === 'A') || (tthBase === 'C' && jthBase === 'G') || (tthBase === 'G' && jthBase === 'C')) {
                    const currBp = [t, j];
                    let currSecArg = [];
                    currSecArg.push(currBp);
                    if (t > i) {
                        currSecArg = currSecArg.concat(OPT[i][t - 1]);
                    }
                    currSecArg = currSecArg.concat(OPT[t + 1][j - 1]);

                    if (currSecArg.length > secArgSize) {
                        secArg = currSecArg;
                        secArgSize = currSecArg.length;
                    }
                }
            }

            if (firstArgSize >= secArgSize) {
                OPT[i][j] = firstArg;
            } else {
                OPT[i][j] = secArg;
            }
        }
    }

    return OPT[1][n];
}

rl.question('Enter RNA sequence: ', (RNASequence) => {
    const maxBasePairs = ssPredictor(RNASequence.trim());
    console.log(`Maximum base pairs = ${maxBasePairs.length}`);
    maxBasePairs.forEach(([i, j]) => {
        console.log(`${i} ${j}`);
    });
    rl.close();
});
