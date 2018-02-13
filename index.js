const currentDownloads = require('./current.json');
const fs = require('fs');

let final = { enterprise: [], 'community': [] };
let csv = ['server, platform, arch, distro'];

currentDownloads.versions.forEach(function (version) {
  const date = version.date;
  const srcURL = version.downloads[0].archive.url;
  const ver = parseVersion(srcURL);

  console.log('------------');
  console.log('DATE:', date, 'VERSION:', ver);
  console.log('------------');

  version.downloads.filter(function (download) {
    return download.edition !== "source";
  }).map(function (download) {
    let platform;
    if (download.archive.url.match('linux')) platform = 'linux';
    if (download.archive.url.match('win'))   platform = 'win';
    if (download.archive.url.match('osx'))   platform = 'osx';

    let string = `${platform} ${download.arch} ${download.target}`;
    if (download.edition === 'base')       final.community.push(string);
    if (download.edition === 'enterprise') final.enterprise.push(string);

    let csvString = `${download.edition}, ${platform}, ${download.arch}, ${download.target}`;
    csv.push(csvString);

    console.log(download.edition, string);
  })
});

fs.writeFileSync('file.csv', csv.join('\n'));

function parseVersion (url) {
  let parts = url.split('/');
  let filename = parts[parts.length - 1];
  return filename.match(/\d+\.\d+\.\d+/)[0];
}
