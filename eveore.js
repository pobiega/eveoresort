const Manipula = require('manipula');
const domready = require('domready');

let sortedList = {};
const itemRegex = /(\w+\s?\w+)(?:\s{2,}|\t)(\d+)/;


function CopyToClipboard() {
    const el = document.getElementById("orelist");
    el.select();
    document.execCommand('copy');
}

function AddOrCreate(ore, count) {
    if (ore in sortedList) {
        sortedList[ore] += count;
    } else {
        sortedList[ore] = count;
    }
}

function GetBaseOreName(ore) {
    const split = ore.split(" ");
    return split[split.length - 1];
}

function CombineAndSort() {
    const orelist = document.getElementById("orelist");

    if (!orelist) {
        // error
        return;
    }

    let unsorted = orelist.value.split("\n");

    if (!unsorted) {
        // error
        return;
    }

    unsorted.forEach(item => {
        const split = itemRegex.exec(item);


        if (!split || split.length < 3) {
            // error
            return;
        }

        const ore = split[1];
        const count = parseInt(split[2]);

        AddOrCreate(ore, count);
    });

    const source = Manipula.from(Object.keys(sortedList));
    const longestName = source.aggregate("", (seed, f) => f.length > seed.length ? f : seed);
    const groups = source.groupBy(ore => GetBaseOreName(ore)).select(x => x.toArray()).toArray();

    if (!groups) {
        return;
    }

    const padLength = longestName.length + 2;
    let sb = [];

    groups.forEach(group => {
        group.forEach(oreName => {
            const paddedName = oreName.padEnd(padLength, ' ');
            sb.push(paddedName, sortedList[oreName], "\n");
        });
    });

    orelist.value = sb.join("");
}

domready(() => {
    var combineButton = document.getElementById('CombineAndSort');
    combineButton.addEventListener('click', CombineAndSort);

    var copyButton = document.getElementById('CopyToClipboard');
    copyButton.addEventListener('click', CopyToClipboard);
});