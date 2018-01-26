const fs = require("fs");
const path = require("path");
const srtJs = require("../build/srt.js");

let toJSON = fs.readFileSync('tests\\toSRT.srt', 'utf8');

test('toJSON', () => {
    expect(srtJs.toJSON(toJSON)).toMatchObject([{"sequence":"1","start":1.5550000000000002,"end":3.141,"caption":"<i>Anteriormente...</i>\r"},{"sequence":"2","start":4.523,"end":6.647,"caption":"Preciso encontrar uma pessoa.\r"}]);
});