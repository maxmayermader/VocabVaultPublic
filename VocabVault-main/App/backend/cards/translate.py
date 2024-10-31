import deepl
import os
import string

def translateText(text, source='en', dest='en', formality='default'):
    authKey = 🤫
    text = string.capwords(text)
    translator = deepl.Translator(authKey)

    res = translator.translate_text(text, source_lang=source, target_lang=dest, formality=formality).text
    # print(res)
    return res
