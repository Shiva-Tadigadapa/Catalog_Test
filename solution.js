const fs = require('fs');

const readInputFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading input file:', error);
        return null;
    }
};

const decodeValue = (base, value) => {
    const baseNum = parseInt(base);
    if (baseNum < 2 || baseNum > 36) {
        throw new Error(`Base ${base} is out of valid range (2-36).`);
    }
    return parseInt(value, baseNum);
};

const lagrangeInterpolation = (points) => {
    let constantTerm = 0;

    points.forEach((pointA, i) => {
        let [xA, yA] = pointA;
        let term = yA;

        points.forEach((pointB, j) => {
            if (i !== j) {
                let [xB, _] = pointB;
                term *= xB / (xB - xA);
            }
        });

        constantTerm += term;
    });

    return Math.round(constantTerm);
};

const findConstantTerm = (filePath) => {
    const input = readInputFile(filePath);
    if (!input) return;

    const { keys, ...roots } = input;
    const { n, k } = keys;

    if (n < k) {
        console.error("Not enough roots provided.");
        return;
    }

    const points = Object.entries(roots).map(([x, { base, value }]) => {
        return [parseInt(x), decodeValue(base, value)];
    });

    const constantTerm = lagrangeInterpolation(points.slice(0, k));
    console.log('Constant term (c):', constantTerm);
};

findConstantTerm('input.json');