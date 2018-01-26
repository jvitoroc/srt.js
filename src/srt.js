const srtJs = function() {
    /* initialize API */
};

const SEQUENCE = /^\d+$/m;
const TIMECODE_LINE = /^((\d{2}):(\d{2}):(\d{2}),(\d{3})) --> ((\d{2}):(\d{2}):(\d{2}),(\d{3}))/;
const TIMECODE = /(\d{2}):(\d{2}):(\d{2}),(\d{3})/;
const CAPTION = /^[^]+/;
const EMPTY_LINE = /^\s*$/;

/**
 * Converts timecode to seconds
 * @param {number|string} h - Hours
 * @param {number|string} m - Minutes
 * @param {number|string} s - Seconds
 * @param {number|string} ms - Miliseconds
 * @returns {number} The result of the conversion
 */
function spreadToSeconds(h, m, s, ms) {
    return (h * 3600 + m * 60 + s * 1 + ms / 1000);
}

/**
 * Converts timecode to seconds
 * @param {string} timecode - Timecode
 * @returns {number} The result of the conversion 
 */
function timecodeToSeconds(timecode) {
    let spread = TIMECODE.exec(timecode);
    if (spread === null)
        throw new Error(
            `[srt.js:timecodeToSeconds] Argument is invalid`
        );

    return spreadToSeconds(spread[1], spread[2], spread[3], spread[4]);
}

/**
 * Converts s to timecode
 * @param {number} s - Seconds
 * @returns {string} The result of the conversion
 */
function secondsToTimecode(s) {
    // Check if 's' is already a timecode
    if (typeof s !== "number")
        return s;
    
    let h = Math.floor(s / 3600);
    let m = s / 60;
    let mf = Math.floor(m);
    let sf = Math.floor((m - mf) * 60);
    let ms = (s - Math.floor(s)) * 1000;

    h = h < 10 ? `0${h}` : h;
    mf = mf < 10 ? `0${mf}` : mf;
    sf = sf < 10 ? `0${sf}` : sf;
    ms = Math.round(ms);

    return `${h}:${mf}:${sf},${ms}`;
}

/**
 * Converts both timecode start and end to seconds;
 * @param {Array} timecodes
 * @returns {Object} A object that contains the results
 */
function convertTimecodes(timecodes) {
    let start = spreadToSeconds(
        timecodes[2],
        timecodes[3],
        timecodes[4],
        timecodes[5]
    );
    let end = spreadToSeconds(
        timecodes[7],
        timecodes[8],
        timecodes[9],
        timecodes[10]
    );

    return {
        start,
        end
    };
}

/**
 * Returns the JSON version of srt
 * @param {string} srt
 * @param {boolean} [convertTimecode=true] - Allow timecode to seconds conversion
 * @returns {Object} JSON version of srt
 */
function toJSON(srt, convertTimecode = true) {
    let lines = srt.split("\n");
    let length = lines.length;

    let output = [];
    let buffer = {};
    let sequence;
    let timecodes;

    let currentCaption;
    let caption = "";
    let captionOffset;
    let index;

    for (let i = 0; i < length; i++) {
        // Check if line has the sequence
        if ((sequence = SEQUENCE.exec(lines[i]))) {
            captionOffset = 2; // Lines between sequence and caption
            index = sequence[0];
            buffer.sequence = index;
            sequence = null;
            let timecodes = TIMECODE_LINE.exec(lines[i + 1]);
            if (timecodes === null) {
                throw new Error(
                    `[srt.js] Timecodes are missing or in the wrong format at line ${i +
              1}: ${lines[i + 1]}`
                );
            }

            if (convertTimecode)
                Object.assign(buffer, convertTimecodes(timecodes));
            else {
                buffer.start = timecodes[1];
                buffer.end = timecodes[6];
            }
            currentCaption = lines[captionOffset + i];
            while (
                EMPTY_LINE.test(currentCaption) === false &&
                captionOffset + i < length
            ) {
                caption += currentCaption + "\n";
                captionOffset += 1;
                currentCaption = lines[captionOffset + i];
            }
            buffer.caption = caption.slice(0, -1);
            caption = "";
            // skip impossible lines
            i = i + captionOffset;
            output.push(buffer);
            buffer = {};
        }
    }

    return output;
}

/**
 * Returns the SubRip Text version of map
 * @param {Object} map
 * @returns {string} SubRip Text version of map
 */
function toSRT(map) {
    let output = "";
    for (let sub of map) {
        output +=
            `${sub.sequence}\n` +
            `${secondsToTimecode(sub.start)} --> ${secondsToTimecode(sub.end)}\n` +
            `${sub.caption}\n\n`;
    }
    output = output.slice(0, -2);
    return output;
}

// Top-Level API
export {
    toJSON,
    toSRT,
    secondsToTimecode,
    spreadToSeconds,
    timecodeToSeconds
};