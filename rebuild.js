/* data generator for omi-parliament-endpoint */

var fs = require('fs');
var csv = require('fast-csv');

var known_mps = {};

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
            english: current_MP[1],
            myanmar: current_MP[2]
          },
          questions: current_MP_questions
        }), function (err) {
          if (err) {
            throw err;
          }
        });
      }
    };

    for (var r = 0; r < qrows.length; r++) {
      var question = qrows[r];
      var mpid = question[0];
      if (!known_mps[mpid]) {
        // save a record for the previous MP
        if (current_MP) {
          writeCurrentMP();
        }
        // update current_MP
        current_MP = [question[1], question[2]];
        current_MP_id = mpid;
        current_MP_questions = [];

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

      var question_id = question[14];
      var qjson = {
        id: question_id,
        source: {
          id: mpid,
          english: question[1],
          myanmar: question[2]
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
        }
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
    };

    for (var r = 0; r < mrows.length; r++) {
      var motion = mrows[r];
      var mpid = motion[0];
      if (!known_mps[mpid]) {
        // save a record for the previous MP
        if (current_MP) {
          writeCurrentMP();
        }
        // update current_MP
        current_MP_id = mpid;
        current_MP = [motion[1], motion[2]];
        current_MP_motions = [];

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

      var motion_id = motion[14];
      var mjson = {
        id: motion_id,
        source: {
          id: mpid,
          english: motion[1],
          myanmar: motion[2]
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

      fs.writeFile('./motions/' + motion_id + '.json', JSON.stringify(mjson), function (err) {
        if (err) {
          throw err;
        }
      });

      delete mjson['source'];
      current_MP_motions.push(mjson);
    }
    // write last MP
    writeCurrentMP();
  });
