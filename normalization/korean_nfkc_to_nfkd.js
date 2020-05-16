const u_hangul_jamo                   = [0x1100, 0x11ff];
const u_hangul_compatibility_jamo     = [0x3130, 0x318f];
const u_hangul_enclosed_cjk_letters_1 = [0x3200, 0x321e]; // ㈀ ~ ㈞ 
const u_hangul_enclosed_cjk_letters_2 = [0x3260, 0x327f]; // ㉠ ~ ㉿
const u_hangul_jamo_extended          = [0xA960, 0xA97F];
const u_hangul_syllables              = [0xAC00, 0xD7AF];
const u_hangul_jamo_extended_b        = [0xD7B0, 0xD7FF];
const u_hangul_halfwidth_fullwidth_1  = [0xFFA0, 0xFFBE];
const u_hangul_halfwidth_fullwidth_2  = [0xFFC2, 0xFFC7];
const u_hangul_halfwidth_fullwidth_3  = [0xFFCA, 0xFFCF];
const u_hangul_halfwidth_fullwidth_4  = [0xFFD2, 0xFFD7];
const u_hangul_halfwidth_fullwidth_5  = [0xFFDA, 0xFFDC];

const hangul_ranges = [
    u_hangul_jamo                  ,
    u_hangul_compatibility_jamo    ,
    u_hangul_enclosed_cjk_letters_1,
    u_hangul_enclosed_cjk_letters_2,
    u_hangul_jamo_extended         ,
    u_hangul_syllables             ,
    u_hangul_jamo_extended_b       ,
    u_hangul_halfwidth_fullwidth_1 ,
    u_hangul_halfwidth_fullwidth_2 ,
    u_hangul_halfwidth_fullwidth_3 ,
    u_hangul_halfwidth_fullwidth_4 ,
    u_hangul_halfwidth_fullwidth_5 
];

function foreach_hangul(fn) {
    hangul_ranges.forEach(subrange => {
        for (let i = subrange[0]; i <= subrange[1]; i++) {
            fn(i);
        }
    });
}

const fs = require('fs');

let input_file = fs.readFileSync('./nmt_nfkc.tsv', {encoding: 'utf8'});

let parsed = (input_file
    .split("\n")
    .filter(x => x !== '')
    .map(x => x.split('\t'))
    .map(v => {
        v[0] = v[0].split(' ').map(x => parseInt(x, 16)).filter(x => !isNaN(x));
        v[1] = v[1].split(' ').map(x => parseInt(x, 16)).filter(x => !isNaN(x));
        return v;
    })
);

let hangul_range_set = new Set();
foreach_hangul(x => hangul_range_set.add(x));

let without_hangul = (parsed
    .filter(x => x[0].every(x => !hangul_range_set.has(x)))
    .filter(x => x[1].every(x => !hangul_range_set.has(x)))
);

let all_hangul_int = []
foreach_hangul(x => all_hangul_int.push(x));

let hangul_nfkd = (all_hangul_int
    .map(x => String.fromCharCode(x))
    .map(x => [x, x.normalize('NFKD')])
    .filter(x => x[0] !== x[1])
    .map(x => {
        x[0] = x[0].split('');
        x[1] = x[1].split('');
        return x;
    })
);

let hangul_nfkd_number = (hangul_nfkd
    .map(x => {
        x[2] = `# ${x[0]} => ${x[1].join('')}`;
        return x;
    }).map((x, i) => {
        x[0] = x[0].map(x => x.charCodeAt(0));
        x[1] = x[1].map(x => x.charCodeAt(0));
        return x;
    })
    .map(x => {
        x[0] = x[0].map(x => x.toString(16));
        x[1] = x[1].map(x => x.toString(16));
        return x;
    })
);

let final_map = without_hangul.slice().map(x => {
    x[0] = x[0].map(x => x.toString(16))
    x[1] = x[1].map(x => x.toString(16))
    return x;
});

hangul_nfkd_number.forEach(x => {
    final_map.push(x);
});
console.log(final_map[0])
console.log(final_map[final_map.length-1])
final_map = final_map.map(x => 
    x[0].join(' ')
    + '\t'
    + x[1].join(' ')
    + '\t'
    + x[2]
    );

fs.writeFileSync('nmt_nfkc_jamonized.tsv', final_map.join('\n'), {encoding: 'utf8'});