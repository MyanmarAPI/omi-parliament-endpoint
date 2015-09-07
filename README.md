## omi-parliament-endpoint

Static JSON API based on data released by the Open Myanmar Initiative

Part of the MaePaySoh API for Myanmar Elections 2015

## Dataset

There are three datasets covering March 2011 to November 2014

- biographical info for members of parliament (name, party, birthdate, gender, ethnicity, occupation)
- questions by members of parliament
- motions by members of parliament

## API documentation

All endpoint URLs begin with ```http://myanmarapi.github.io/omi-parliament-endpoint```

### Members API

***/members/all.json***

Returns a JSON array of all members of parliament.

```javascript
[
  {
    "id": "MP-ID",
    "name": {
      "english": "English Name",
      "myanmar": "မြန်မာ"
    },
    "house": {
      "english": "English Name",
      "myanmar": "မြန်မာ"
    },
    "constituency": {
      "english": "English Name",
      "myanmar": "မြန်မာ"
    },
    "party": "",
    "gender": "M or F"
  },
  ...
]
```

***/members/NAME.json***

Returns a JSON object with more detailed information about an individual member of parliament.

NAME can be in Myanmar language or in English.

```javascript
{
  "id": "MP-ID",
  "name": {
    "english": "English Name",
    "myanmar": "မြန်မာ"
  },
  "house": {
    "english": "English Name",
    "myanmar": "မြန်မာ"
  },
  "constituency": {
    "english": "English Name",
    "myanmar": "မြန်မာ"
  },
  "gender": "M or F",
  "birthdate": "",
  "occupation": "",
  "party": "",
  "ethnicity": ""
}
```

***/members/regions/REGION.json***

Returns a JSON array of parliament members from this REGION. The REGION can be
in Myanmar language or in English.

***/members/constituencies/CONSTITUENCY.json***

Returns a JSON array of parliament members from this CONSTITUENCY. The CONSTITUENCY can be in Myanmar language or in English.

### Questions API

***/questions/NAME.json***

Returns a JSON array of questions by parliament member with this NAME. Each
question comes with a QUESTION_ID provided by OMI.

NAME can be in Myanmar language or in English.

```javascript
{
 "id": "MP-ID",
 "name": {
   "english": "English Name",
   "myanmar": "မြန်မာ"
 }
 "questions": [
   {
   "id": "CBQ-01-01-001",
   "house": "First Amyotha Hluttaw",
   "session": "First Regular Session",
   "date": "24-Mar-11",
   "description": {
     "english": "Cultivation of summer paddy",
     "myanmar": ""
   },
   "issue": "Agriculture",
   "respondent": {
     "name": "U Htay Oo",
     "position": "Agriculture and Irrigation Minister"
   }
  },
  ...
  ...
  ]
}
```

If there are no recorded questions from this MP, you will get an empty array:

```javascript
{
 "id": "MP-ID",
 "name": {
   "english": "English Name",
   "myanmar": "မြန်မာ"
 }
 "questions": [
 ]
}
```

***/questions/QUESTION_ID.json***

Returns a JSON object with information about an individual question by a parliament member.

```javascript
{
   "id": "CBQ-01-01-001",
   "source": {
     "id": "MP-ID",
     "english": "English Name",
     "myanmar": "မြန်မာ"
   },
   "house": "First Amyotha Hluttaw",
   "session": "First Regular Session",
   "date": "24-Mar-11",
   "description": {
     "english": "Cultivation of summer paddy",
     "myanmar": ""
   },
   "issue": "Agriculture",
   "respondent": {
     "name": "U Htay Oo",
     "position": "Agriculture and Irrigation Minister"
   }
}
```

### Motions API

***/motions/NAME.json***

Returns a JSON array of motions by parliament member with this NAME. Each
motion comes with a MOTION_ID provided by OMI.

NAME can be in Myanmar language or in English.

```javascript
{
  "id": "MP-ID",
  "name": {
    "english": "English Name",
    "myanmar": "မြန်မာ"
  }
  "motions": [
    {
      "id": "CBM-01-01-004",
      "source": {
        "english": "English Name",
        "myanmar":"မြန်မာ"
      },
      "submitted_date": "24-Mar-11",
      "house": "First Pyidaungsu Hluttaw",
      "session": "First Regular Session",
      "description": {
        "english": "Concerning about economic sanction",
        "myanmar": ""
      },
      "issue": "Business",
      "purpose": "Scrutiny",
      "status": "Recorded",
      "response_date": "25-Mar-11",
      "respondent": {
        "name":"U Hla Tun",
        "position":"Finance and Revenue Minister"
      }
    },
    ...
  ]
}
```

***/motions/MOTION_ID.json***

Returns a JSON object with information about an individual motion by a parliament member.

```javascript
{
  "id": "CBM-01-01-004",
  "source": {
    "id": "MP-ID",
    "english": "English Name",
    "myanmar":"မြန်မာ"
  },
  "submitted_date": "24-Mar-11",
  "house": "First Pyidaungsu Hluttaw",
  "session": "First Regular Session",
  "description": {
    "english": "Concerning about economic sanction",
    "myanmar": ""
  },
  "issue": "Business",
  "purpose": "Scrutiny",
  "status": "Recorded",
  "response_date": "25-Mar-11",
  "respondent": {
    "name":"U Hla Tun",
    "position":"Finance and Revenue Minister"
  }
}
```

If there are no recorded motions from this MP, you will get an empty array:

```javascript
{
 "id": "MP-ID",
 "name": {
   "english": "English Name",
   "myanmar": "မြန်မာ"
 }
 "motions": [
 ]
}
```

## Data updates

Update the files in /source/, then run:

```bash
rm -rf questions/* motions/*
node rebuild.js
git add .
git commit -m "data update 2015-09-01"
```

## License

Data collected by Open Myanmar Initiative

JavaScript code is open sourced under an MIT license
