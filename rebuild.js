/* data generator for omi-parliament-endpoint */

var fs = require('fs');
var csv = require('fast-csv');

var known_mps = {};

var mprows = [];
var allmps = [];

var regions = {};
var constituencies = {};

csv.fromPath('./source/upper-house-members.tsv', { delimiter: '\t'})
  .on('data', function (row) {
    mprows.push(row);
  })
  .on('end', function () {
    csv.fromPath('./source/lower-house-members.tsv', { delimiter: '\t'})
      .on('data', function (row) {
        mprows.push(row);
      })
      .on('end', function () {
        var column_names = mprows.splice(0, 1);
        for (var r = 0; r < mprows.length; r++) {
          var mp = mprows[r];
          var mpid = mp[0];

          var mpdata;
          var con_number = mp[4];
          if (!con_number || !isNaN(con_number * 1)) {
            // upper house
            mpdata = {
              id: mp[0],
              name: {
                english: mp[1],
                myanmar: mp[2]
              },
              constituency: {
                name: {
                  english: mp[3],
                  myanmar: mp[6]
                },
                number: mp[4]
              },
              region: {
                english: mp[5],
                myanmar: mp[6]
              },
              party: mp[7],
              gender: mp[8],
              ethnicity: mp[9],
              religion: mp[10],
              birthdate: mp[11],
              occupation: mp[12],
              house: mp[13],
              term: {
                elected: mp[14],
                term_end: mp[15]
              }
            };
          } else {
            // lower house
            mpdata = {
              id: mp[0],
              name: {
                english: mp[1],
                myanmar: mp[2]
              },
              constituency: {
                name: {
                  english: mp[3],
                  myanmar: mp[4]
                },
                number: 0
              },
              region: {
                english: mp[5],
                myanmar: mp[6]
              },
              party: mp[7],
              gender: mp[8],
              ethnicity: mp[9],
              religion: mp[10],
              birthdate: mp[11],
              occupation: mp[12],
              house: mp[13],
              term: {
                elected: mp[14],
                term_end: mp[15]
              }
            };
          };

          // organize candidates by constituency and region
          if (!constituencies[mp[3]]) {
            constituencies[mp[3]] = [mp[3], mp[4]];
          }
          constituencies[mp[3]].push(mpdata);
          if (!regions[mp[5]]) {
            regions[mp[5]] = [mp[5], mp[6]];
          }
          regions[mp[5]].push(mpdata);

          known_mps[mpid] = mpdata;
          allmps.push(mpdata);
          var mpcontent = JSON.stringify(mpdata);

          fs.writeFile('./members/' + mpdata.name.myanmar + '.json', mpcontent, function (err) {
            if (err) {
              throw err;
            }
          });
          fs.writeFile('./members/' + mpdata.name.english + '.json', mpcontent, function (err) {
            if (err) {
              throw err;
            }
          });
          fs.writeFile('./members/' + mpid + '.json', mpcontent, function (err) {
            if (err) {
              throw err;
            }
          });
        }

        fs.writeFile('./members/all.json', JSON.stringify(allmps), function (err) {
          if (err) {
            throw err;
          }
        });

        for (var constituency in constituencies) {
          fs.writeFile('./members/constituencies/' + constituencies[constituency][0] + '.json', JSON.stringify(constituencies[constituency].slice(2)), function (err) {
            if (err) {
              throw err;
            }
          });
          fs.writeFile('./members/constituencies/' + constituencies[constituency][1] + '.json', JSON.stringify(constituencies[constituency].slice(2)), function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
        for (var region in regions) {
          fs.writeFile('./members/regions/' + regions[region][0] + '.json', JSON.stringify(regions[region].slice(2)), function (err) {
            if (err) {
              throw err;
            }
          });
          fs.writeFile('./members/regions/' + regions[region][1] + '.json', JSON.stringify(regions[region].slice(2)), function (err) {
            if (err) {
              throw err;
            }
          });
        }

        writeQuestionsAndMotions();
      });
  });

function writeQuestionsAndMotions() {
  var qrows = [];
  csv.fromPath('./source/questions.tsv', { delimiter: '\t' })
    .on('data', function (row) {
      qrows.push(row);
    })
    .on('end', function () {
      // separate column names from rest of rows
      var column_names = qrows.splice(0, 1);
      var current_MP = null;
      var current_MP_id = null;
      var current_MP_questions = [];

      var writeCurrentMP = function () {
        if (!current_MP) {
          return;
        }
        for (var n = 0; n < current_MP.length; n++) {
          fs.writeFile('./questions/' + current_MP[n] + '.json', JSON.stringify({
            id: current_MP_id,
            name: {
              english: current_MP[0],
              myanmar: current_MP[1]
            },
            questions: current_MP_questions
          }), function (err) {
            if (err) {
              throw err;
            }
          });
        }
        fs.writeFile('./questions/' + current_MP_id + '.json', JSON.stringify({
          id: current_MP_id,
          name: {
            english: current_MP[0],
            myanmar: current_MP[1]
          },
          questions: current_MP_questions
        }), function (err) {
          if (err) {
            throw err;
          }
        });
      };

      for (var r = 0; r < qrows.length; r++) {
        var question = qrows[r];
        var mpid = question[0];
        if (!known_mps[mpid]) {
          // add this MP to the known_mps
          var mpjson = {
            id: mpid,
            name: {
              english: question[1],
              myanmar: question[2]
            },
            constituency: question[3],
            region: question[4],
            party: question[5],
            gender: question[6],
            ethnicity: question[7],
            religion: question[8],
            dob: question[9],
            occupation: question[10],
            term: {
              elected: question[12],
              term_end: question[13]
            }
          };
          known_mps[mpid] = mpjson;
        }

        // update current_MP
        if (mpid != current_MP_id) {
          writeCurrentMP();
          current_MP = [known_mps[mpid].name.english, known_mps[mpid].name.myanmar];
          current_MP_questions = [];
          current_MP_id = mpid;
        }
        known_mps[mpid].questions = true;

        var question_id = question[14];
        var qjson = {
          id: question_id,
          source: {
            id: mpid,
            english: known_mps[mpid].name.english,
            myanmar: known_mps[mpid].name.myanmar
          },
          house: question[11],
          session: question[16],
          date: question[17],
          description: {
            english: question[18],
            myanmar: question[19]
          },
          issue: question[20],
          respondent: {
            name: question[21],
            position: question[22]
          },
          purpose: question[24]
        };

        fs.writeFile('./questions/' + question_id + '.json', JSON.stringify(qjson), function (err) {
          if (err) {
            throw err;
          }
        });

        delete qjson['source'];
        current_MP_questions.push(qjson);
      }
      // write last MP
      writeCurrentMP();

      // write missing mps
      for (var mpid in known_mps) {
        if (!known_mps[mpid].questions) {
          fs.writeFile('./questions/' + mpid + '.json', JSON.stringify({
            "id": mpid,
            "name": known_mps[mpid].name,
            "questions": []
          }), function (err) {
            if (err) {
              throw err;
            }
          });
        }
      }
    });


  var mrows = [];
  csv.fromPath('./source/motions.tsv', { delimiter: '\t' })
    .on('data', function (row) {
      mrows.push(row);
    })
    .on('end', function () {
      // separate column names from rest of rows
      var column_names = mrows.splice(0, 1);
      var current_MP = null;
      var current_MP_id = null;
      var current_MP_motions = [];

      var writeCurrentMP = function () {
        if (!current_MP) {
          return;
        }
        for (var n = 0; n < current_MP.length; n++) {
          if (!current_MP[n]) {
            continue;
          }
          fs.writeFile('./motions/' + current_MP[n] + '.json', JSON.stringify({
            id: current_MP_id,
            name: {
              english: current_MP[0],
              myanmar: current_MP[1]
            },
            motions: current_MP_motions
          }), function (err) {
            if (err) {
              throw err;
            }
          });
        }
        fs.writeFile('./motions/' + current_MP_id + '.json', JSON.stringify({
          id: current_MP_id,
          name: {
            english: current_MP[0],
            myanmar: current_MP[1]
          },
          motions: current_MP_motions
        }), function (err) {
          if (err) {
            throw err;
          }
        });
      };

      for (var r = 0; r < mrows.length; r++) {
        var motion = mrows[r];
        var mpid = motion[0];
        if (!known_mps[mpid]) {
          // add this MP to the known_mps
          var mpjson = {
            id: mpid,
            name: {
              english: motion[1],
              myanmar: motion[2]
            },
            constituency: motion[3],
            region: motion[4],
            party: motion[5],
            gender: motion[6],
            ethnicity: motion[7],
            religion: motion[8],
            dob: motion[9],
            occupation: motion[10],
            term: {
              elected: motion[12],
              term_end: motion[13]
            }
          };
          known_mps[mpid] = mpjson;
        }

        // update current_MP
        if (mpid != current_MP_id) {
          writeCurrentMP();
          current_MP = [known_mps[mpid].name.english, known_mps[mpid].name.myanmar];
          current_MP_questions = [];
          current_MP_id = mpid;
        }
        known_mps[mpid].motions = true;

        var motion_id = motion[14];
        var mjson = {
          id: motion_id,
          source: {
            id: mpid,
            english: known_mps[mpid].name.english,
            myanmar: known_mps[mpid].name.myanmar
          },
          submitted_date: motion[15],
          house: motion[16],
          session: motion[17],
          description: {
            english: motion[18],
            myanmar: motion[19]
          },
          issue: motion[20],
          purpose: motion[21],
          status: motion[22],
          response_date: motion[23],
          respondent: {
            name: motion[24],
            position: motion[25]
          }
        };

        if (motion_id) {
          fs.writeFile('./motions/' + motion_id + '.json', JSON.stringify(mjson), function (err) {
            if (err) {
              throw err;
            }
          });
        }

        delete mjson['source'];
        current_MP_motions.push(mjson);
      }
      // write last MP
      writeCurrentMP();

      // write missing mps
      for (var mpid in known_mps) {
        if (!known_mps[mpid].motions) {
          fs.writeFile('./motions/' + mpid + '.json', JSON.stringify({
            "id": mpid,
            "name": known_mps[mpid].name,
            "motions": []
          }), function (err) {
            if (err) {
              throw err;
            }
          });
        }
      }
    });
}
