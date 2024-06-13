# Offline Download Instructions

### Step 1: Clone from Github

In your terminal, navigate to the folder in which you want to download.
Run the following

```
git clone https://github.com/alabamadictionary/alabamadictionary.github.io.git
```

### Step 2: How to run

To run this code you will need to have a HTML Live server extension for Visual Studio Code.

<img width="315" alt="Screenshot 2024-05-23 at 4 14 09 PM" src="https://github.com/alabamadictionary/alabamadictionary.github.io/assets/169401244/a754c3e5-45ae-46e5-809a-3103ae9113b8">

Open the cloned `alabamadictionary` folder and click the live server button and your local copy will run!

<img width="158" alt="Screenshot 2024-05-24 at 12 08 36 AM" src="https://github.com/alabamadictionary/alabamadictionary.github.io/assets/169401244/082ff2c9-8a6b-47c9-95b5-a2913c95c498">

# File Structure
## dict.json
This file contains all the information for dictionary entries with which the dictionary app sorts. A maximal entry looks like the following

```
...,
{
    "lemma": "manka",
    "definition": "to say, ask",
    "class": "-LI/3",
    "principalPart": "maiⁿska, maiⁿlka, maaⁿska",
    "derivation": "[prob. /mam-ka1]",
    "notes": "nan",
    "sentences": [
        {
            "alabama-example": "Nàason maiⁿska?\n ",
            "english-translation": "What did you say?"
        }
    ],
    "relatedTerms": [
        "mam"
    ]
},
...
```
The following is a discussion of each field:

# lemma
Lemma refers to the actual dictionary item, or Alabama word. To insert new entries, you need to have a 'standardized' word with which to insert, written in the Alabama alphabet/orthography. Make sure to keep this consistent, as any audio files must also share the name of the 'lemma' field in order to be visible to users. 
# definition
As one may suspect, this contains the information about a word. Different senses (multiple, unrelated meanings) are separated by semicolons. Related meanings are separated by commas. 
# class 
This refers to the subject marking strategy. If the subject marking strategy is not known or is unclear, this should be "nan". Otherwise, the class indicated should follow the following schema:

1. Stative verbs which begin in `cha-` in the *first person singular* (I/me form) should have a class "CHA-". This includes words like `kaano`
2. Stative verbs which begin in `am-` in the *first person singular* (I/me form) should have a class "AM-". This includes words like `illokbachi`. 
3. Active verbs which end in `-li` in the *first person singular* (I/me form) should have a class "-LI". This includes words like `waliika`. If these types of verbs are able to have an object (ex: I see **you**), the class should instead be "-LI/CHA-" if the object is marked with `cha-` (ex: `chahiichali`), "-LI/AM-" if the object is marked with `am-` (ex: `amhiichali`), or "-LI/3" if the object can not be a human.
# principalPart
This refers to the three conjugated forms of the bare verb stem. In order, these are the *second person singular* (you), *first person plural* (we), *second person plural* (you all). These should be separated by a comma.

In the case where no conjugated forms are known, this should simply read "nan". Otherwise, if at least one is known, the unknown parts should be written with a single hyphen. For example:

```
  "principalPart": "chókkòochi, -, -"
```

# derivation
This is derivational information. If the underlying etymology is known, this should be filled out. Otherwise, unless one is certain, this should simply read "nan". If one does know the etymology, the structure is simple. Roots are introduced by `/`, while affixes are introduced with a hyphen. 

For the example of 'manka', the derivation `[/mam-ka1]` indicates a root 'man' followed by a suffix 'ka1'.

# notes
No entries currently have notes, but if there is any additional information you would like to include, you may do it here, or else simply read "nan"

# sentences

Any example sentences should go here. Sentences are set up as a list of sentence entries. Each sentence entry contains a "alabama-example", where you can put the actual sentence, and a "english-translation" where you can put the corresponding sentence. Be sure to remove any double quotation marks in these sentences and replace them with single quote lines or with an escape character (ex: `\"`). To add more sentences, separate sentence entries with a comma, like so:

```
"sentences": [
        {
            "alabama-example": "Nàason maiⁿska?\n ",
            "english-translation": "What did you say?"
        },
        {
            "alabama-example": "`Achichakkilaho' mankalihchonkalo.",
            "english-translation": "I said, `I want to go with you."
        }
    ]
```

If there are no example sentences, this should be an empty list `[]`.

# relatedTerms

Like sentences, this is a list of all terms which share a root. If your word shares a root with another word, the root should go here, separated by commas. For example, the root in 'manka' was 'man', so it is included in the relatedTerms. Like `sentences`, if this is empty, it should be an empty list.

# Synthesis
A minimum entry in the dict.json file looks like the following:
```
...,
{
    "lemma": "manka",
    "definition": "to say, ask",
    "class": "nan",
    "principalPart": "nan",
    "derivation": "nan",
    "notes": "nan",
    "sentences": [],
    "relatedTerms": []
},
...
```



